import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Acl, AclAction, AclPossession, AclResource, AclRole } from '@stechy1/diplomka-share';

import {
  GetAllActionsQuery,
  GetAllPossessionsQuery,
  GetAllResourcesQuery,
  GetAllRolesQuery,
  GetAllAclQuery,
  AclUpdateCommand,
  AclInsertCommand, AclDeleteCommand
} from '@neuro-server/stim-feature-acl/application';

@Injectable()
export class AclFacade {
  private readonly logger = new Logger(AclFacade.name);

  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async getAcl(): Promise<Acl[]> {
    return this.queryBus.execute(new GetAllAclQuery());
  }
  public async updateAcl(acl: Acl): Promise<number> {
    return this.commandBus.execute(new AclUpdateCommand(acl));
  }
  public async insertAcl(acl: Acl): Promise<number> {
    return this.commandBus.execute(new AclInsertCommand(acl));
  }
  public async deleteAcl(id: number): Promise<boolean> {
    return this.commandBus.execute(new AclDeleteCommand(id));
  }

  public async getActions(): Promise<AclAction[]> {
    return this.queryBus.execute(new GetAllActionsQuery());
  }
  public async getPossessions(): Promise<AclPossession[]> {
    return this.queryBus.execute(new GetAllPossessionsQuery());
  }
  public async getResources(): Promise<AclResource[]> {
    return this.queryBus.execute(new GetAllResourcesQuery());
  }
  public async getRoles(): Promise<AclRole[]> {
    return this.queryBus.execute(new GetAllRolesQuery());
  }
}
