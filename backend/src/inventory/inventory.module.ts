import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { StockLevel } from './entities/stock-level.entity';
import { InventoryMovement } from './entities/inventory-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockLevel, InventoryMovement])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
