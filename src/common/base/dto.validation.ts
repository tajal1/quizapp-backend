import { BadRequestException, ValidationPipe } from '@nestjs/common'

export const validateDto = async (body: any, dtoClass: any) => {
    const dto = new dtoClass()
    Object.assign(dto, body)

    // Use ValidationPipe for DTO validation and throw error if validation fails
    const validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: errors =>
            new BadRequestException({
                statusCode: 400,
                message: 'Validation failed',
                errors: errors.map(err => ({
                    property: err.property,
                    message: err.constraints
                }))
            })
    })

    return await validationPipe.transform(dto, { type: 'body', metatype: dtoClass })
}
