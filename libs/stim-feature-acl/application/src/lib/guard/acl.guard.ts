import { AccessControl, IQueryInfo } from 'accesscontrol';

import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Acl, User } from '@stechy1/diplomka-share';

import { ACL_MODULE_CONFIG_CONSTANT, ACL_TOKEN, AclModuleConfig, PermissionDeniedException } from '@neuro-server/stim-feature-acl/domain';

import { AclService } from '../service/acl.service';

@Injectable()
export class AclGuard implements CanActivate {

  private readonly logger: Logger = new Logger(AclGuard.name);

  constructor(@Inject(ACL_MODULE_CONFIG_CONSTANT) private readonly config: AclModuleConfig,
              private readonly reflector: Reflector, private readonly service: AclService) {}

  protected async getUser(context: ExecutionContext): Promise<User> {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }

  protected async getUserRoles(context: ExecutionContext): Promise<string[]> {
    const user = await this.getUser(context);

    return user.acl?.map((acl: Acl) => {
      return acl.role
    }) || [];
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // Pokud jsou ACL globálně deaktivována
    if (!this.config.enabled) {
      // Vždy povolím aktivaci zdroje
      return true;
    }

    const acl = this.reflector.get<Acl[]>(ACL_TOKEN, context.getHandler());
    if (!acl) {
      this.logger.verbose('Žádné role nenalezeny, povoluji požadavek.')
      return true;
    }

    this.logger.debug(JSON.stringify(acl));
    const userRoles: string[] = await this.getUserRoles(context);
    this.logger.debug(userRoles);
    try {
      const granted = acl.every(role => {
        const queryInfo: IQueryInfo = role;
        queryInfo.role = userRoles;
        const permission = this.service.getPermission(queryInfo);
        return permission.granted;
      });
      this.logger.verbose(`Na základě ACL ${granted ? '' : 'ne'}byl udělan přístup ke zdroji.'`);
      return granted;
    } catch (e) {
      if (AccessControl.isAccessControlError(e)) {
        throw new PermissionDeniedException(e);
      } else {
        throw e;
      }
    }
  }

}
