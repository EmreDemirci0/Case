import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Item } from '../item/item.entity';

@Entity('item_levels')
export class ItemLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.levels, { onDelete: 'CASCADE' })
  item: Item;

  @Column()
  level: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

}
