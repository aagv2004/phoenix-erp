import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users') // Nombre de la tabla en Postgres
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

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

  @Column('text', {
    array: true,
    default: ['user'], // Por defecto son usuarios normales (luego agregamos 'admin')
  })
  roles: string[];

  // Auditoría: Cuándo se creó y cuándo se actualizó
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
