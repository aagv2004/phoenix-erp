import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStockLevelDto } from './dto/create-stock-level.dto';
import { UpdateStockLevelDto } from './dto/update-stock-level.dto';
import { StockLevel } from './entities/stock-level.entity';
import { CreateMovementDto } from './dto/create-movement.dto';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { MovementType } from './enums/movement-type.enum';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger('InventoryService');

  constructor(
    @InjectRepository(StockLevel)
    private readonly stockLevelRepository: Repository<StockLevel>,
    @InjectRepository(InventoryMovement)
    private readonly movementRepository: Repository<InventoryMovement>,
  ) {}

  // ============== STOCK LEVELS ==============

  async create(createStockLevelDto: CreateStockLevelDto) {
    try {
      const stockLevel = this.stockLevelRepository.create(createStockLevelDto);
      await this.stockLevelRepository.save(stockLevel);
      return stockLevel;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findAll() {
    return this.stockLevelRepository.find({
      relations: ['product', 'branch'],
    });
  }

  async findByBranch(branchId: string) {
    return this.stockLevelRepository.find({
      where: { branchId },
      relations: ['product', 'branch'],
    });
  }

  async findByProduct(productId: string) {
    return this.stockLevelRepository.find({
      where: { productId },
      relations: ['product', 'branch'],
    });
  }

  async findOne(id: string) {
    const stockLevel = await this.stockLevelRepository.findOne({
      where: { id },
      relations: ['product', 'branch'],
    });

    if (!stockLevel)
      throw new BadRequestException('Nivel de stock no encontrado');
    return stockLevel;
  }

  async update(id: string, updateStockLevelDto: UpdateStockLevelDto) {
    const stockLevel = await this.stockLevelRepository.preload({
      id,
      ...updateStockLevelDto,
    });

    if (!stockLevel)
      throw new BadRequestException(`Stock con id ${id} no encontrado`);

    try {
      await this.stockLevelRepository.save(stockLevel);
      return stockLevel;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const stockLevel = await this.findOne(id);
    await this.stockLevelRepository.remove(stockLevel);
    return { message: 'Nivel de stock eliminado correctamente' };
  }

  // 🚨 ALERTAS DE STOCK BAJO
  async getLowStockAlerts(branchId?: string) {
    const queryBuilder = this.stockLevelRepository
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('stock.branch', 'branch')
      .where('stock.quantity <= stock.minStock')
      .andWhere('stock.minStock > 0'); // Solo alertar si hay mínimo configurado

    if (branchId) {
      queryBuilder.andWhere('stock.branchId = :branchId', { branchId });
    }

    const lowStockItems = await queryBuilder.getMany();

    return lowStockItems.map((stock) => ({
      id: stock.id,
      product: {
        id: stock.product.id,
        name: stock.product.name,
        sku: stock.product.sku,
      },
      branch: {
        id: stock.branch.id,
        name: stock.branch.name,
      },
      currentStock: stock.quantity,
      minStock: stock.minStock,
      difference: Number(stock.minStock) - Number(stock.quantity),
      severity: this.calculateSeverity(
        Number(stock.quantity),
        Number(stock.minStock),
      ),
    }));
  }

  // 📊 Calcula qué tan crítico es el stock bajo
  private calculateSeverity(
    current: number,
    min: number,
  ): 'critical' | 'warning' | 'low' {
    const percentage = (current / min) * 100;

    if (percentage === 0 || current === 0) return 'critical'; // Sin stock
    if (percentage <= 25) return 'critical'; // Menos del 25% del mínimo
    if (percentage <= 50) return 'warning'; // Entre 25% y 50%
    return 'low'; // Entre 50% y 100%
  }

  // 📈 ESTADÍSTICAS DE INVENTARIO
  async getInventoryStats(branchId?: string) {
    const queryBuilder = this.stockLevelRepository
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('stock.branch', 'branch');

    if (branchId) {
      queryBuilder.where('stock.branchId = :branchId', { branchId });
    }

    const allStock = await queryBuilder.getMany();

    const totalProducts = allStock.length;
    const lowStock = allStock.filter(
      (s) => Number(s.quantity) <= Number(s.minStock) && Number(s.minStock) > 0,
    ).length;
    const outOfStock = allStock.filter((s) => Number(s.quantity) === 0).length;
    const overStock = allStock.filter(
      (s) => Number(s.maxStock) > 0 && Number(s.quantity) > Number(s.maxStock),
    ).length;

    return {
      totalProducts,
      lowStock,
      outOfStock,
      overStock,
      healthyStock: totalProducts - lowStock - outOfStock - overStock,
      alerts: {
        critical: allStock.filter(
          (s) =>
            this.calculateSeverity(Number(s.quantity), Number(s.minStock)) ===
            'critical',
        ).length,
        warning: allStock.filter(
          (s) =>
            this.calculateSeverity(Number(s.quantity), Number(s.minStock)) ===
            'warning',
        ).length,
      },
    };
  }

  // ============== MOVIMIENTOS DE INVENTARIO ==============

  async recordMovement(createMovementDto: CreateMovementDto) {
    const { productId, branchId, quantity, type } = createMovementDto;

    let stockLevel = await this.stockLevelRepository.findOne({
      where: { productId, branchId },
    });

    if (!stockLevel) {
      stockLevel = this.stockLevelRepository.create({
        productId,
        branchId,
        quantity: 0,
        minStock: 0,
        maxStock: 0,
      });
    }

    const previousStock = Number(stockLevel.quantity);
    let newStock = previousStock;

    switch (type) {
      case MovementType.ENTRY:
      case MovementType.TRANSFER_IN:
        newStock = previousStock + Number(quantity);
        break;

      case MovementType.EXIT:
      case MovementType.TRANSFER_OUT:
        newStock = previousStock - Number(quantity);
        if (newStock < 0) {
          throw new BadRequestException(
            `Stock insuficiente. Stock actual: ${previousStock}, intentando retirar: ${quantity}`,
          );
        }
        break;

      case MovementType.ADJUSTMENT:
        newStock = Number(quantity);
        break;
    }

    stockLevel.quantity = newStock;

    try {
      await this.stockLevelRepository.save(stockLevel);

      const movement = this.movementRepository.create({
        ...createMovementDto,
        previousStock,
        newStock,
      });

      await this.movementRepository.save(movement);

      return {
        movement,
        stockLevel,
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async transferBetweenBranches(transferDto: {
    productId: string;
    fromBranchId: string;
    toBranchId: string;
    quantity: number;
    notes?: string;
    userId?: string;
  }) {
    const { productId, fromBranchId, toBranchId, quantity, notes, userId } =
      transferDto;

    if (fromBranchId === toBranchId) {
      throw new BadRequestException('No puedes transferir a la misma sucursal');
    }

    const exitMovement = await this.recordMovement({
      type: MovementType.TRANSFER_OUT,
      productId,
      branchId: fromBranchId,
      quantity,
      notes: notes || `Transferencia a otra sucursal`,
      userId,
      relatedBranchId: toBranchId,
    });

    const entryMovement = await this.recordMovement({
      type: MovementType.TRANSFER_IN,
      productId,
      branchId: toBranchId,
      quantity,
      notes: notes || `Transferencia desde otra sucursal`,
      userId,
      relatedBranchId: fromBranchId,
    });

    return {
      from: exitMovement,
      to: entryMovement,
      message: `Transferencia de ${quantity} unidades del producto ${productId} desde la sucursal ${fromBranchId} a la sucursal ${toBranchId} realizada exitosamente.`,
    };
  }

  async getMovementHistory(filters?: {
    branchId?: string;
    productId?: string;
    type?: MovementType;
    startDate?: Date;
    endDate?: Date;
  }) {
    const queryBuilder = this.movementRepository
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.product', 'product')
      .leftJoinAndSelect('movement.branch', 'branch')
      .leftJoinAndSelect('movement.user', 'user')
      .leftJoinAndSelect('movement.relatedBranch', 'relatedBranch')
      .orderBy('movement.createdAt', 'DESC');

    if (filters?.branchId) {
      queryBuilder.andWhere('movement.branchId = :branchId', {
        branchId: filters.branchId,
      });
    }

    if (filters?.productId) {
      queryBuilder.andWhere('movement.productId = :productId', {
        productId: filters.productId,
      });
    }

    if (filters?.type) {
      queryBuilder.andWhere('movement.type = :type', { type: filters.type });
    }

    if (filters?.startDate) {
      queryBuilder.andWhere('movement.createdAt >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      queryBuilder.andWhere('movement.createdAt <= :endDate', {
        endDate: filters.endDate,
      });
    }

    return await queryBuilder.getMany();
  }

  async getMovementsByProduct(productId: string) {
    return this.movementRepository.find({
      where: { productId },
      relations: ['product', 'branch', 'user', 'relatedBranch'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMovementsByBranch(branchId: string) {
    return this.movementRepository.find({
      where: { branchId },
      relations: ['product', 'branch', 'user', 'relatedBranch'],
      order: { createdAt: 'DESC' },
    });
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(
        'Ya existe un registro de stock para este producto en esta sucursal',
      );
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Error inesperado, revisa los logs del servidor',
    );
  }
}
