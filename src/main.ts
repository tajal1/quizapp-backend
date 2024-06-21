import helmet from 'helmet'
import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule } from '@nestjs/swagger'
import { config } from './common/config/swagger.config'
import { CORS_CONFIG } from './common/config/cors.config'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    const configService = app.get(ConfigService)
    const APP_ROUTE_PREFIX = 'api'

    app.use(helmet())
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    app.enableCors(CORS_CONFIG)
    app.setGlobalPrefix(APP_ROUTE_PREFIX)
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
    app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI })

    SwaggerModule.setup(`${APP_ROUTE_PREFIX}/docs`, app, SwaggerModule.createDocument(app, config))
    await app.listen(configService.get<string>('PORT'))
}

bootstrap()
