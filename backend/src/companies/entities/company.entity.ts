import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity'; // <--- Importar esto
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  tax_id: string; // Acuérdate de cambiar esto si en tu DB se llama diferente

  @Column('text', { nullable: true })
  description: string;

  // NUEVA RELACIÓN 👇
  // Una Empresa (One) tiene Muchas Sucursales (Many)
  @OneToMany(() => Branch, (branches) => branches.company)
  branches: Branch[];

  // Nueva relación con productos
  @OneToMany(() => Product, (product) => product.company)
  products: Product[];

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
