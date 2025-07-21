import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ItemLevel } from '../item-level/item-level.entity';
import { ItemInstance } from '../item-instance/item-instance.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => ItemLevel, (level) => level.item)
  levels: ItemLevel[];

  @OneToMany(() => ItemInstance, (instance) => instance.item)
  instances: ItemInstance[];
}
