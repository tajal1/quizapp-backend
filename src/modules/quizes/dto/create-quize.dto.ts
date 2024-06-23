import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { QUIZ_CONSTANT } from 'src/common/config/constant'
import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, ValidateNested } from 'class-validator'

export class QuizePerSubjectDto {
    @ApiProperty({
        example: QUIZ_CONSTANT.SUBJECT_CODE.MATH.CODE,
        enum: QUIZ_CONSTANT.SUBJECT_CODE.CODE_ENUM,
        required: true
    })
    @MaxLength(15, {
        message: 'Question length must be at most 255 characters.'
    })
    @IsNotEmpty({ message: 'Please enter subject code.' })
    @IsString({ message: 'Subject code must be a string.' })
    subject_code: string

    @ApiProperty({ example: 5, required: true })
    @IsNotEmpty({ message: 'Please enter the question.' })
    @IsNumber({}, { message: 'Quiz number must be a number.' })
    @Max(99, { message: 'Quiz number must be at most 99.' })
    quiz_number: number
}

export class CreateQuizeDto {
    @ApiProperty({ type: [QuizePerSubjectDto] })
    @ValidateNested({ each: true })
    @Type(() => QuizePerSubjectDto)
    quiz_number_per_subject: QuizePerSubjectDto[]
}
