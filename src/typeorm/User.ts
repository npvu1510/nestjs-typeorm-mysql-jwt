import { IsEmail, IsStrongPassword } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv4();

  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Column()
  dateOfBirth: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 30 })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
