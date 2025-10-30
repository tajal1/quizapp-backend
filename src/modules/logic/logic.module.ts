import { forwardRef, Module } from '@nestjs/common';
import { LogicService } from './logic.service';
import { LogicController } from './logic.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[forwardRef(() => UsersModule)],
  controllers: [LogicController],
  providers: [LogicService],
  exports:[LogicService]
})
export class LogicModule {}
