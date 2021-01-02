import { Injectable, Logger } from '@nestjs/common';

import { FindManyOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '@stechy1/diplomka-share';

import { UserEntity, UserIdNotFoundException, UserNotFoundException, UsersRepository } from '@diplomka-backend/stim-feature-users/domain';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(private readonly _repository: UsersRepository) {}

  async findAll(options?: FindManyOptions<UserEntity>): Promise<User[]> {
    this.logger.verbose(`Hledám všechny uživatele s filtrem: '${JSON.stringify(options ? options.where : {})}'.`);
    const userResults: User[] = await this._repository.all(options);
    this.logger.verbose(`Bylo nalezeno: ${userResults.length} záznamů.`);
    return userResults;
  }

  async byId(id: number): Promise<User> {
    this.logger.verbose(`Hledám uživatele s id: ${id}.`);
    const userResult = await this._repository.one({ select: ['id', 'username', 'email', 'lastLoginDate', 'createdAt', 'updatedAt'], where: { id } });
    if (userResult === undefined) {
      this.logger.warn(`Uživatel s id: ${id} nebyl nalezen!`);
      throw new UserIdNotFoundException(id);
    }
    return userResult;
  }

  async byEmail(email: string): Promise<User> {
    this.logger.verbose(`Hledám uživatele s e-mailem: ${email}.`);
    const userResult = await this._repository.one({ where: { email } });
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
    const oritinalUser = await this.byId(<number>userResult.id);
    if (oritinalUser === undefined) {
      return undefined;
    }

    this.logger.verbose('Aktualizuji uživatele.');
    const result = await this._repository.update(userResult);
  }

  async delete(id: number): Promise<void> {
    const user = await this.byId(id);
    if (user === undefined) {
      return undefined;
    }

    this.logger.verbose(`Mažu uživatele s id: ${id}`);
    const result = await this._repository.delete(id);
  }

  async hashPassword(password: string, saltRounds = 12): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
