import { DocumentBuilder } from '@nestjs/swagger'

export const config = new DocumentBuilder()
    .setTitle('Quiz app backend')
    .setDescription('A dynamic quiz app for users')
    .setVersion('1.0.0')
    // .addTag('v2')
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter JWT token',
            in: 'header'
        },
        'JWT'
    )
    .build()
