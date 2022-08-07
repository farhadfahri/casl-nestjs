import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AbilityModule } from 'src/ability/ability.module';
import { AbilityFactory } from 'src/ability/ability.factory';

@Module({
  imports: [AbilityModule],
  controllers: [UserController],
  providers: [UserService, AbilityFactory],
})
export class UserModule {}
