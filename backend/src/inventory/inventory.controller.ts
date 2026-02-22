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
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateStockLevelDto } from './dto/create-stock-level.dto';
import { UpdateStockLevelDto } from './dto/update-stock-level.dto';
import { CreateMovementDto } from './dto/create-movement.dto';
import { MovementType } from './enums/movement-type.enum';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // ============== STOCK LEVELS ==============

  @Post()
  create(@Body() createStockLevelDto: CreateStockLevelDto) {
    return this.inventoryService.create(createStockLevelDto);
  }

  @Get()
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

  // 🚨 ENDPOINT DE ALERTAS
  @Get('alerts/low-stock')
  getLowStockAlerts(@Query('branchId') branchId?: string) {
    return this.inventoryService.getLowStockAlerts(branchId);
  }

  // 📊 ENDPOINT DE ESTADÍSTICAS
  @Get('stats/overview')
  getInventoryStats(@Query('branchId') branchId?: string) {
    return this.inventoryService.getInventoryStats(branchId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStockLevelDto: UpdateStockLevelDto,
  ) {
    return this.inventoryService.update(id, updateStockLevelDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryService.remove(id);
  }

  // ============== MOVIMIENTOS DE INVENTARIO ==============

  @Post('movements')
  recordMovement(@Body() createMovementDto: CreateMovementDto) {
    return this.inventoryService.recordMovement(createMovementDto);
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
