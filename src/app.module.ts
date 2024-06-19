import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {WinstonModule} from 'nest-winston';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { WinstonConfig } from './common/config/winston.config';
@Module({
  imports: [
    WinstonModule.forRoot({}),
    WinstonModule.forRootAsync({
        useFactory: (configService: ConfigService) => ({
            transports: [
                new WinstonConfig().access(configService), 
                new WinstonConfig().error(configService), 
                new WinstonConfig().format()
            ]
        }),
        inject: [ConfigService],
    }),
    ConfigModule.forRoot({
        isGlobal: true,
        load: [() => require(`../config/${process.env.NODE_ENV || 'development'}.json`),],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
