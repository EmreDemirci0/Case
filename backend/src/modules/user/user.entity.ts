import { Entity, Column, PrimaryGeneratedColumn, Unique, BeforeInsert, CreateDateColumn } from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: true })
  full_name: string;

  @Column({ length: 100 })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastEnergyUpdateAt: Date;

}

