import * as winston from 'winston';
import { utilities } from 'nest-winston';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WinstonConfig {

  error(configService: ConfigService) {
    return new winston.transports.File({ filename: `${process.cwd()}/${configService.get( 'LOG_PATH')}/${configService.get('LOG_ERROR')}`,
      level: 'error',
    });
  }

  access(configService: ConfigService) {
    return new winston.transports.File({ filename: `${process.cwd()}/${configService.get( 'LOG_PATH' )}/${configService.get('LOG_ACCESS')}`,
      level: 'info',
    });
  }

  format() {
    return new winston.transports.Console({
      format: winston.format.combine( winston.format.timestamp(), utilities.format.nestLike() ),
    });
  }
}
