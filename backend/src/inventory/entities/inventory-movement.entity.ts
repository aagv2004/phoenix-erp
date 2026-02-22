import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Branch } from '../../branches/entities/branch.entity';
import { User } from '../../users/entities/user.entity';
import { MovementType } from '../enums/movement-type.enum';

@Entity('inventory_movements')
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MovementType,
  })
  type: MovementType;

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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'previous_stock' })
  previousStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'new_stock' })
  newStock: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Esto es para saber qué usuario hizo el movimiento.
  @ManyToOne(() => User, { eager: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  // Esto será para las transferencias, sucursal de origen/destino
  @ManyToOne(() => Branch, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'related_branch_id' })
  relatedBranch: Branch;

  @Column({ name: 'related_branch_id', nullable: true })
  relatedBranchId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
