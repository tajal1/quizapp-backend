import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { VALIDATE_DTO } from '../decorators/validate-dto.decorator';

@Injectable()
export class DtoValidationInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        console.log('==========<<>>')
        const request = context.switchToHttp().getRequest();
        const handler = context.getHandler();
        const controllerClass = context.getClass();

        // Check method-level metadata first, then controller-level
        const validationConfig = Reflect.getMetadata(VALIDATE_DTO, handler) || Reflect.getMetadata(VALIDATE_DTO, controllerClass);
        if (validationConfig) {
            const { dtoClass, url, method } = validationConfig;

            // Validate if request matches URL and method
            if (
                request.method === method &&
                (request.url === url || request.url.startsWith(url + '?') || request.url.startsWith(url + '/'))
            ) {
                const body = request.body;

                // Convert to DTO instance
                const dto = plainToClass(dtoClass, body);

                // Validate
                const errors = await validate(dto);
                if (errors.length > 0) {
                    const errorMessages = errors.map((error) =>
                        Object.values(error.constraints).join(', '),
                    );
                    throw new BadRequestException(errorMessages);
                }

                // Custom validation for CreateUserDto
                if (dtoClass.name === 'CreateUserDto' && !body.email?.includes('@')) {
                    throw new BadRequestException('Email must contain @ symbol');
                }

                // Update request body
                request.body = dto;
            }
        }

        return next.handle();
    }
}