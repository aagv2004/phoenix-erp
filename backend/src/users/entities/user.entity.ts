import { Company } from '../../companies/entities/company.entity';
import { UserRole } from '../enums/roles.enum';
import { Branch } from '../../branches/entities/branch.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('users') // Nombre de la tabla en Postgres
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  full_name: string;

  @Column('text', {
    unique: true, // No pueden haber dos usuarios con el mismo email
  })
  email: string;

  @Column('text', {
    select: false, // ¡TRUCAZO! Por defecto, no devolveremos la contraseña al buscar usuarios
  })
  password: string;

  @Column('bool', {
    default: true, // Por defecto nacen activos
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLEADO,
  })
  role: UserRole;

  // Auditoría: Cuándo se creó y cuándo se actualizó
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  branch_id: string;

  @ManyToOne(() => Branch, (branch) => branch.users)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({
    nullable: true,
  })
  company_id: string;

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
