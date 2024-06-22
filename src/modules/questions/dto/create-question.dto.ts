import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsBoolean, MaxLength, IsNumber, Max } from 'class-validator'
import { QUIZ_CONSTANT } from 'src/common/config/constant'

export class CreateQuestionDto {
    @ApiProperty({ example: 'What is the capital of France?', required: true })
    @MaxLength(255, {
        message: 'Question length must be at most 255 characters.'
    })
    @IsNotEmpty({ message: 'Please enter the question.' })
    @IsString({ message: 'Question must be a string.' })
    question: string

    @ApiProperty({ example: 'Option A', required: true })
    @MaxLength(255, {
        message: 'Option length must be at most 255 characters.'
    })
    @IsNotEmpty({ message: 'Please enter option A.' })
    @IsString({ message: 'Option A must be a string.' })
    a: string

    @ApiProperty({ example: 'Option B', required: true })
    @MaxLength(255, {
        message: 'Option length must be at most 255 characters.'
    })
    @IsNotEmpty({ message: 'Please enter option B.' })
    @IsString({ message: 'Option B must be a string.' })
    b: string

    @ApiProperty({ example: 'Option C', required: true })
    @MaxLength(255, {
        message: 'Option length must be at most 255 characters.'
    })
    @IsNotEmpty({ message: 'Please enter option C.' })
    @IsString({ message: 'Option C must be a string.' })
    c: string

    @ApiProperty({ example: 'Option D', required: true })
    @MaxLength(255, {
        message: 'Option length must be at most 255 characters.'
    })
    @IsNotEmpty({ message: 'Please enter option D.' })
    @IsString({ message: 'Option D must be a string.' })
    d: string

    @ApiProperty({
        example: QUIZ_CONSTANT.SUBJECT_CODE.MATH.CODE,
        enum: QUIZ_CONSTANT.SUBJECT_CODE.CODE_ENUM,
        required: true
    })
    @MaxLength(50, {
        message: 'Subject code length must be at most 50 characters.'
    })
    @IsNotEmpty({ message: 'Please enter the subject code.' })
    @IsString({ message: 'Subject code must be a string.' })
    subject_code: string

    @ApiProperty({
        example: QUIZ_CONSTANT.SUBJECT_CODE.MATH.NAME,
        enum: QUIZ_CONSTANT.SUBJECT_CODE.CODE_ENUM,
        required: true
    })
    @MaxLength(50, {
        message: 'Subject name length must be at most 50 characters.'
    })
    @IsNotEmpty({ message: 'Please enter the subject name.' })
    @IsString({ message: 'Subject code must be a string.' })
    subject_name: string

    @ApiProperty({ example: 'Option D', required: true })
    @MaxLength(255, {
        message: 'Answer length must be at most 255 character.'
    })
    @IsNotEmpty({ message: 'Please enter the correct answer.' })
    @IsString({ message: 'Answer must be a string.' })
    answer: string

    @ApiProperty({ example: 1, required: false })
    @IsNotEmpty({ message: 'Please enter positive score of the question.' })
    @IsNumber({}, { message: 'Positive score must be a number.' })
    @Max(99, { message: 'Positive score must be at most 99.' })
    positive_score: number

    @ApiProperty({ example: 0.25, required: false })
    @IsNotEmpty({ message: 'Please enter negetive score of the question.' })
    @IsNumber({}, { message: 'Negetive score must be a number.' })
    @Max(99, { message: 'Negetive score must be at most 99.' })
    negetive_score: number

    @ApiProperty({ example: true, required: true })
    @IsNotEmpty({ message: 'Approval status is required.' })
    @IsBoolean({ message: 'Approval status must be a boolean.' })
    is_approved: boolean
}
