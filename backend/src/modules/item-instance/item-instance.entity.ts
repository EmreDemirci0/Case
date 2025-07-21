import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Item } from '../item/item.entity';

@Entity('item_instances')
export class ItemInstance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Item, (item) => item.instances, { eager: true })
  item: Item;

  @Column({ type: 'int', default: 1 })
  currentLevel: number;

  @CreateDateColumn()
  createdAt: Date;
}
