import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemLevel } from './item-level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemLevel])],
})
export class ItemLevelModule { }
