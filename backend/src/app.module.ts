import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/user/user.entity'; // Entity (birazdan ekleyeceğiz)
import { UserModule } from './modules/user/user.module'; // Modül (birazdan ekleyeceğiz)
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { Item } from './modules/item/item.entity';
import { ItemInstance } from './modules/item-instance/item-instance.entity';
import { ItemModule } from './modules/item/item.module';
import { ItemLevel } from './modules/item-level/item-level.entity';
import { ItemLevelModule } from './modules/item-level/item-level.module';
import { ItemInstanceModule } from './modules/item-instance/item-instance.module';
import { ItemController } from './modules/item/item.controller';
import { ItemLevelController } from './modules/item-level/item-level.controller';
import { ItemService } from './modules/item/item.service';
import { ItemLevelService } from './modules/item-level/item-level.service';
import { ItemInstanceService } from './modules/item-instance/item-instance.service';
import { ItemInstanceController } from './modules/item-instance/item-instance.controller';
import { AppSetting } from './modules/app-setting/app-setting.entity';
import { AppSettingModule } from './modules/app-setting/app-setting.module';
import { AppSettingController } from './modules/app-setting/app-setting.controller';
import { AppSettingService } from './modules/app-setting/app-setting.service';
import { ApiController } from './modules/api/api.controller';
import { ItemLevelTranslation } from './modules/item-level-translation/item-level-translation.entity';
import { ItemLevelTranslationModule } from './modules/item-level-translation/item-level-translation.module';
import { ItemLevelTranslationController } from './modules/item-level-translation/item-level-translation.controller';
import { ItemLevelTranslationService } from './modules/item-level-translation/item-level-translation.service';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // kendi PostgreSQL kullanıcı adını yaz
      password: 'localhost', // kendi şifreni yaz
      database: 'CaseNS', // pgAdmin'de oluşturduğun veritabanı adı
      entities: [User, Item, ItemInstance, ItemLevel,AppSetting,ItemLevelTranslation],
      synchronize: true, // otomatik tablo oluşturma, prod'da false olmalı
    }),
    TypeOrmModule.forFeature([User]), UserModule,
    TypeOrmModule.forFeature([Item]), ItemModule,
    TypeOrmModule.forFeature([ItemLevel]), ItemLevelModule,
    TypeOrmModule.forFeature([ItemLevelTranslation]), ItemLevelTranslationModule,
    TypeOrmModule.forFeature([ItemInstance]), ItemInstanceModule,
    TypeOrmModule.forFeature([AppSetting]), AppSettingModule,
  ],
  controllers: [AppController, UserController, ItemController, ItemLevelController, ItemInstanceController,AppSettingController,ItemLevelTranslationController,ApiController],
  providers: [AppService, UserService, ItemService, ItemLevelService, ItemInstanceService,AppSettingService,ItemLevelTranslationService],
})
export class AppModule { }
