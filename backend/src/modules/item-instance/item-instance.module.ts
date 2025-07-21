import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemInstance } from './item-instance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemInstance])],
})
export class ItemInstanceModule { }
