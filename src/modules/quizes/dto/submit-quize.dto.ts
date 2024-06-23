import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsMongoId, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class AnsweredQuizDto {
    @ApiProperty({
        example: '66759652705428b199c73f59',
        required: true
    })
    @IsNotEmpty({ message: 'Please enter the quiz element ID.' })
    @IsMongoId({ message: 'Quiz element ID must be a valid MongoDB ObjectId.' })
    _id: string

    @ApiProperty({
        example: 'Option B',
        required: true
    })
    @IsNotEmpty({ message: 'Please enter the user answer.' })
    @IsString({ message: 'User answer must be a string.' })
    user_answer: string
}

export class SubmitQuizDto {
    @ApiProperty({
        type: [AnsweredQuizDto],
        required: true
    })
    @IsArray({ message: 'Quizes must be an array.' })
    @ValidateNested({ each: true })
    @Type(() => AnsweredQuizDto)
    quizes: AnsweredQuizDto[]

}
