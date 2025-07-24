import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Item } from '../item/item.entity';
import { ItemLevelTranslation } from '../item-level-translation/item-level-translation.entity';

@Entity('item_levels')
export class ItemLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.levels, { onDelete: 'CASCADE' })
  item: Item;

  @Column()
  level: number;

  @Column({ nullable: true })
  imageUrl: string;

  
@OneToMany(() => ItemLevelTranslation, (translation) => translation.itemLevel)
translations: ItemLevelTranslation[];

}
