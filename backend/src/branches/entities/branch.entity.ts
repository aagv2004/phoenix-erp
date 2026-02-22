import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { User } from '../../users/entities/user.entity';
import { StockLevel } from '../../inventory/entities/stock-level.entity';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  address: string;

  @OneToMany(() => User, (user) => user.branch)
  users: User[];

  @OneToMany(() => StockLevel, (stock) => stock.branch)
  stock_levels: StockLevel[];

  @ManyToOne(() => Company, (company) => company.branches, {
    onDelete: 'CASCADE',
  })
  company: Company;
}
