import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateStockLevelDto } from './dto/create-stock-level.dto';
import { UpdateStockLevelDto } from './dto/update-stock-level.dto';
import { CreateMovementDto } from './dto/create-movement.dto';
import { MovementType } from './enums/movement-type.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserRole } from '../users/enums/roles.enum';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // ============ STOCK LEVELS ============

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.DIRECTOR, UserRole.GERENTE)
  create(@Body() createStockLevelDto: CreateStockLevelDto) {
    return this.inventoryService.create(createStockLevelDto);
  }

  @Get()
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.DIRECTOR,
    UserRole.GERENTE,
    UserRole.EMPLEADO,
  )
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('branch/:branchId')
  findByBranch(@Param('branchId', ParseUUIDPipe) branchId: string) {
    return this.inventoryService.findByBranch(branchId);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.inventoryService.findByProduct(productId);
  }

  @Get('alerts/low-stock')
  getLowStockAlerts(@Query('branchId') branchId?: string) {
    return this.inventoryService.getLowStockAlerts(branchId);
  }

  @Get('stats/overview')
  getInventoryStats(@Query('branchId') branchId?: string) {
    return this.inventoryService.getInventoryStats(branchId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.DIRECTOR, UserRole.GERENTE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStockLevelDto: UpdateStockLevelDto,
  ) {
    return this.inventoryService.update(id, updateStockLevelDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.DIRECTOR)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryService.remove(id);
  }

  // ============ INVENTORY MOVEMENTS ============

  @Post('movements')
  @Roles(
    UserRole.SUPERADMIN,
    UserRole.DIRECTOR,
    UserRole.GERENTE,
    UserRole.EMPLEADO,
  ) // 👈 Empleados pueden registrar movimientos (POS)
  recordMovement(
    @Body() createMovementDto: CreateMovementDto,
    @GetUser('id') userId: string, // 👈 Extraer el ID del usuario autenticado
  ) {
    // Agregar automáticamente el userId al movimiento
    return this.inventoryService.recordMovement({
      ...createMovementDto,
      userId,
    });
  }

  @Get('movements/history')
  getMovementHistory(
    @Query('branchId') branchId?: string,
    @Query('productId') productId?: string,
    @Query('type') type?: MovementType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.inventoryService.getMovementHistory({
      branchId,
      productId,
      type,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('movements/product/:productId')
  getMovementsByProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.inventoryService.getMovementsByProduct(productId);
  }

  @Get('movements/branch/:branchId')
  getMovementsByBranch(@Param('branchId', ParseUUIDPipe) branchId: string) {
    return this.inventoryService.getMovementsByBranch(branchId);
  }
}
