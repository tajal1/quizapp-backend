import { SetMetadata } from '@nestjs/common';

export const VALIDATE_DTO = 'validate_dto';

export const ValidateDto = (dtoClass: any, url: string, method: string = 'POST') =>
    SetMetadata(VALIDATE_DTO, { dtoClass, url, method });