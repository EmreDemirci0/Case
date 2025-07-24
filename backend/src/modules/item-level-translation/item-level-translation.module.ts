import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemLevelTranslation } from './item-level-translation.entity';
import { ItemLevelTranslationService } from './item-level-translation.service';
import { ItemLevelTranslationController } from './item-level-translation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ItemLevelTranslation])],
  providers: [ItemLevelTranslationService],
  controllers: [ItemLevelTranslationController],
  exports: [ItemLevelTranslationService],
})
export class ItemLevelTranslationModule {}
