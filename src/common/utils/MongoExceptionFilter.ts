import { MongoServerError } from 'mongodb'
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common'

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoServerError, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()

        const status = exception.code === 11000 ? HttpStatus.CONFLICT : HttpStatus.INTERNAL_SERVER_ERROR

        const message =
            exception.code === 11000 && exception.keyPattern.email === 1
                ? 'Email already exists'
                : 'Internal server error'

        response.status(status).json({
            statusCode: status,
            message,
            error: exception.message
        })
    }
}
