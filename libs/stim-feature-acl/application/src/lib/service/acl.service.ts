import { Inject, Injectable, Logger } from '@nestjs/common';
import { AccessControl, IQueryInfo, Permission } from 'accesscontrol';

import { Acl, AclAction, AclPossession, AclResource, AclRole } from '@stechy1/diplomka-share';

import { ACCESS_CONTROL_TOKEN, AclEntity, AclIdNotFoundException, AclRepository, aclToEntity } from '@neuro-server/stim-feature-acl/domain';
import { jsonObjectDiff } from '@neuro-server/stim-lib-common';

@Injectable()
export class AclService {

  private readonly logger: Logger = new Logger(AclService.name);

  constructor(@Inject(ACCESS_CONTROL_TOKEN) private readonly acl: AccessControl,
              private readonly repository: AclRepository) {
  }

  /**
   * Nastaví práva na základě ACL entities.
   *
   * @param entities {@link AclEntity}
   */
  public reloadAclFromEntities(entities: AclEntity[]): void {
    this.logger.verbose('Obnovuji všechna ACL....')
    this.acl.setGrants(this.entitiesToGrants(entities));
  }

  /**
   * Nastaví práva na základě ACL.
   *
   * @param acl {@link Acl}
   */
  public reloadAcl(acl: Acl[]): void {
    this.reloadAclFromEntities(acl.map((a: Acl) => aclToEntity(a)))
  }

  /**
   * Vrátí {@link Permission} objekt reprezentující práva
   * pro přístup k danému zdroji.
   *
   * @param queryInfo {@link IQueryInfo}
   * @return {@link Permission}
   */
  public getPermission(queryInfo: IQueryInfo): Permission {
    return this.acl.permission(queryInfo);
  }

  /* --------------------------------- ACL ---------------------------------- */

  /**
   * Vrátí všechna {@link Acl} pro zadané role.
   *
   * @param roles Indexy rolí
   * @return {@link Acl[]}
   */
  public async aclByRoles(roles: number[]): Promise<Acl[]> {
    return this.repository.all({ roles });
  }

  /**
   * Vrátí všechna dostupná {@link Acl}.
   *
   * @return {@link Acl[]}
   */
  public async getAllAcl(): Promise<Acl[]> {
    return this.repository.all();
  }

  /**
   * Vrátí {@link Acl} na základě ID.
   *
   * @param id ID acl
   * @return {@link Acl}
   * @throws {@link AclIdNotFoundException}
   */
  public async byId(id: number): Promise<Acl> {
    this.logger.verbose(`Vyhledávám ACL s id: ${id}.`);
    const acl = await this.repository.byId(id);

    if (acl === undefined) {
      throw new AclIdNotFoundException(id);
    }

    return acl;
  }

  /**
   * Vloží ACL záznam do databáze.
   *
   * @param acl {@link Acl}
   */
  public async insert(acl: Acl): Promise<number> {
    this.logger.verbose('Vkládám nový ACL záznam do databáze.');
    const result = await this.repository.insert(acl);

    return result.id;
  }

  /**
   * Aktualizuje údaje {@link Acl}.
   *
   * @param acl {@link Acl}
   * @return True, pokud se ACL aktualizovaly, jinak False
   */
  public async updateAcl(acl: Acl): Promise<boolean> {
    const originalAcl = await this.byId(acl.id);
    const diff = jsonObjectDiff(acl, originalAcl);
    this.logger.log(`Diff: ${JSON.stringify(diff)}`);

    if (Object.keys(diff).length === 0) {
      this.logger.verbose('Není co aktualizovat. Žádné změny nebyly detekovány.');
      return false;
    }

    this.logger.verbose('Aktualizuji ACL záznam.');
    const result = await this.repository.update(acl);

    return true;
  }

  /**
   * Vymaže {@link Acl} podle ID.
   *
   * @param id ID {@link Acl}, který se má vymazat
   */
  public async delete(id: number): Promise<void> {
    this.logger.debug(`Mažu ACL záznam s id: ${id}.`);
    const result = await this.repository.delete(id);
  }

  /* ------------------------------- ACL Role ------------------------------- */

  /**
   * Vrátí všechny dostupné {@link AclRole}.
   *
   * @return {@link AclRole}
   */
  public async getRoles(): Promise<AclRole[]> {
    return this.repository.roles();
  }

  /**
   * Vrátí všechny výchozí {@link AclRole}, které se automaticky přiřadí novému uživateli.
   *
   * @return {@link AclRole}
   */
  public async getDefaultRoles(): Promise<AclRole[]> {
    return this.repository.roles({ isDefault: true });
  }

  /* ---------------------------- ACL Possession ---------------------------- */

  /**
   * Vrátí všechny dostupné {@link AclPossession}.
   *
   * @return {@link AclPossession}
   */
  public async getPossessions(): Promise<AclPossession[]> {
    return this.repository.possessions();
  }

  /* ----------------------------- ACL Resource ----------------------------- */

  /**
   * Vrátí všechny dostupné {@link AclResource}.
   *
   * @return {@link AclResource}
   */
  public async getResources(): Promise<AclResource[]> {
    return this.repository.resources();
  }

  /* ------------------------------ ACL Action ------------------------------ */

  /**
   * Vrátí všechny dostupné {@link AclAction}.
   *
   * @return {@link AclAction}
   */
  public async getActions(): Promise<AclAction[]> {
    return this.repository.actions();
  }

  /* ---------------------------- Private methods --------------------------- */

  /**
   * Pomocná funkce pro konverzi {@link AclEntity} na objekt,
   * kterému rozumí {@link AccessControl}.
   *
   * @param entities {@link AclEntity} Entity s právy
   */
  protected entitiesToGrants(entities: AclEntity[]) {
    return entities.map((entity: AclEntity) => {
      return {
        role: entity.role.role,
        resource: entity.resource.resource,
        action: entity.action.action + ':' + entity.possession.possession,
        attributes: entity.attributes.split(';')
      }
    });
  }

}
