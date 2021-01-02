import { EntityManager, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { TriggerControlEntity } from '../model/entity/trigger-control.entity';

@Injectable()
export class TriggersRepository {
  private readonly logger: Logger = new Logger(TriggersRepository.name);

  private readonly _repository: Repository<TriggerControlEntity>;

  constructor(private readonly _manager: EntityManager) {
    this._repository = _manager.getRepository(TriggerControlEntity);
  }

  public async exists(name: string): Promise<boolean> {
    const registeredTrigger = (await this._manager.query('SELECT tbl_name FROM sqlite_master WHERE name = ?', [name])) as { tbl_name: string }[];
    if (registeredTrigger === undefined || registeredTrigger.length === 0) {
      this.logger.verbose(`Trigger: ${name} ještě nebyl inicializován.`);
      return false;
    }
    const triggerControlRecord = await this._repository.find({ where: { name } });
    if (triggerControlRecord === undefined || triggerControlRecord.length === 0) {
      this.logger.verbose(`Trigger '${name}' nebyl nalezen v ovládací tabulce!`);
      return false;
    }

    return true;
  }

  public async toggleTrigger(name: string, enabled: boolean): Promise<void> {
    this.logger.verbose(`Přepínám aktivitu triggeru: '${name}' na: ${enabled}`);
    await this._repository.update({ name }, { enabled });
  }

  public async toggleTriggers(enabled: boolean): Promise<void> {
    this.logger.verbose(`Přepínám aktivitu všech triggerů na: ${enabled}`);
    await this._repository.update({}, { enabled });
  }

  public async insert(name: string, content: string, enabled = true): Promise<void> {
    this.logger.verbose(`Vytvářím nový záznam triggeru '${name}' v databázi.`);
    await this._manager.query(content);

    const entity = new TriggerControlEntity();
    entity.name = name;
    entity.enabled = enabled;

    await this._repository.insert(entity);
  }
}
