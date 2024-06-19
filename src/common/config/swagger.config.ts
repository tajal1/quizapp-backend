import {DocumentBuilder} from '@nestjs/swagger';

export const config = new DocumentBuilder()
    .setTitle('Somu')
    .setDescription('Somu backend api')
    .setVersion('2.0.0')
    .addTag('v2')
    .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT')
    .build();
