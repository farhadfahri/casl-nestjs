import {
  InferSubjects,
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

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

    if (!user.isAdmin) {
      can(Action.Read, User);
    }

    can(Action.Manage, User);

    return build({
      detectSubjectType: (subject) =>
        subject.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
