import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity'; // <--- Importar esto

@Entity()
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
  @OneToMany(() => Branch, (branch) => branch.company)
  branches: Branch[];
}
