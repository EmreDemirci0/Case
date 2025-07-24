import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ItemLevel } from '../item-level/item-level.entity';

@Entity('item_level_translations')
export class ItemLevelTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lang: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => ItemLevel, (itemLevel) => itemLevel.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_level_id' }) // <-- burada değişiklik var
  itemLevel: ItemLevel;
}
