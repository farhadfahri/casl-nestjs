import { ForbiddenError } from '@casl/ability';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../user/entities/user.entity';
import { CHECK_ABILITY, RequiredRule } from './ability.decorator';
import { AbilityFactory } from './ability.factory';

export const currentUser: User = {
  id: 1,
  isAdmin: false,
  orgId: 312,
};

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactor: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('what is handler', context.getHandler());
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const user = currentUser;
    const ability = this.caslAbilityFactor.difineAbility(user);

    try {
      rules.forEach((rule) =>
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
      );
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
      return false;
    }
  }
}
