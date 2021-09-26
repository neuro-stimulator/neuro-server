import { Injectable, Logger } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { User } from '@stechy1/diplomka-share';

import { UserFindOptions, UserIdNotFoundException, UserNotFoundException, UsersRepository } from '@diplomka-backend/stim-feature-users/domain';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(private readonly _repository: UsersRepository) {}

  async findAll(findOptions: UserFindOptions): Promise<User[]> {
    this.logger.verbose(`Hledám všechny uživatele s filtrem: '${JSON.stringify(findOptions)}'.`);
    const userResults: User[] = await this._repository.all(findOptions);
    this.logger.verbose(`Bylo nalezeno: ${userResults.length} záznamů.`);
    return userResults;
  }

  async byId(id: number): Promise<User> {
    this.logger.verbose(`Hledám uživatele s id: ${id}.`);
    const userResult = await this._repository.one({ optionalOptions: { id } });
    if (userResult === undefined) {
      this.logger.warn(`Uživatel s id: ${id} nebyl nalezen!`);
      throw new UserIdNotFoundException(id);
    }
    return userResult;
  }

  async byEmail(email: string): Promise<User> {
    this.logger.verbose(`Hledám uživatele s e-mailem: '${email}'.`);
    const userResult = await this._repository.one({ optionalOptions: { email } });
    if (userResult === undefined) {
      this.logger.warn(`Uživatel s e-mailem: ${email} nebyl nalezen!`);
      throw new UserNotFoundException();
    }
    return userResult;
  }

  async insert(userResult: User): Promise<number> {
    this.logger.verbose('Vkládám nového uživatele do databáze.');
    const result = await this._repository.insert(userResult);

    return result.raw;
  }

  async update(userResult: User): Promise<void> {
    await this.byId(userResult.id);

    this.logger.verbose('Aktualizuji uživatele.');
    const result = await this._repository.update(userResult);
  }

  async delete(id: number): Promise<void> {
    await this.byId(id);

    this.logger.verbose(`Mažu uživatele s id: ${id}`);
    const result = await this._repository.delete(id);
  }

  /* istanbul ignore next */
  async hashPassword(password: string, saltRounds = 12): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  /* istanbul ignore next */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
