import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonConfig } from './common/config/winston.config';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { MongoExceptionFilter } from './common/utils/MongoExceptionFilter';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    WinstonModule.forRoot({}),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transports: [
          new WinstonConfig().access(configService),
          new WinstonConfig().error(configService),
          new WinstonConfig().format(),
        ],
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () =>
          require(`../config/${process.env.NODE_ENV || 'development'}.json`),
      ],
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: MongoExceptionFilter,
    },
  ],
})
export class AppModule {}
