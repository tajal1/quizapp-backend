import { Logger } from 'winston'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Inject, Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest()

        const logInfo = `PATH: ${req.url}, BODY:${JSON.stringify(req.body)}, RESPONSE: }`
        return next.handle().pipe(
            tap(data => {
                this.logger.info(logInfo + `${JSON.stringify(data)}`)
            }),
            catchError((error: any) => {
                this.logger.error(logInfo + `${JSON.stringify(error)}`)
                return throwError(error)
            })
        )
    }
}
