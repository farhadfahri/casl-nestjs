import {
  InferSubjects,
  Ability,
  AbilityBuilder,
  AbilityClass,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

export enum Action {
  Manage = 'manage', // wildcard for any action
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// connecting actions to specific subjects, can use union of subjects
// type Subjects = 'Article' | 'Comment' | 'User';

export type Subjects = InferSubjects<typeof User> | 'all';

// join actions and subjects to define abilities

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  difineAbility(user: User) {
    // define rules here

    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.isAdmin) {
      can(Action.Manage, User);
      cannot(Action.Manage, User, { orgId: { $ne: user.orgId } }).because(
        'You can manage users in your own organization',
      );
    }

    if (!user.isAdmin) {
      can(Action.Read, User);
      cannot(Action.Create, User).because('Permissions');
    }

    return build();
  }
}
