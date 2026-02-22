import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Branch } from '../../branches/entities/branch.entity';

@Entity('stock_levels')
@Unique(['productId', 'branchId']) // 👈 AGREGAR ESTO
export class StockLevel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Branch, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ name: 'branch_id' })
  branchId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'min_stock',
  })
  minStock: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    name: 'max_stock',
  })
  maxStock: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
