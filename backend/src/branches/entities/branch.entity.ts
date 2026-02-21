import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  address: string;

  // RELACIÓN MÁGICA 🔗
  // Una Sucursal (Many) pertenece a Una Empresa (One)
  // onDelete: 'CASCADE' significa que si borras la empresa, se borran sus sucursales solas.
  @ManyToOne(() => Company, (company) => company.branches, {
    onDelete: 'CASCADE',
  })
  company: Company;
}
