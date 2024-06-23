import { QuizesService } from './quizes.service'
import { Test, TestingModule } from '@nestjs/testing'

describe('QuizesService', () => {
    let service: QuizesService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [QuizesService]
        }).compile()

        service = module.get<QuizesService>(QuizesService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
