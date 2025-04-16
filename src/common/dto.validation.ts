import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export async function validateDto(dto: any, dtoClass: any) {
    if (!dtoClass) {
        throw new BadRequestException('No DTO class specified for validation');
    }

    // Convert to DTO instance
    const validatedDto = plainToClass(dtoClass, dto);

    // Validate
    const errors = await validate(validatedDto);
    if (errors.length > 0) {
        const errorMessages = errors.map((error) =>
            Object.values(error.constraints).join(', '),
        );
        throw new BadRequestException(errorMessages);
    }

    // Optional: Custom validation
    if (dtoClass.name === 'CreateUserDto' && !dto.email?.includes('@')) {
        throw new BadRequestException('Email must contain @ symbol');
    }
}