import { createKey } from '@neuro-server/stim-lib-config';

export const ACL_MODULE_CONFIG_CONSTANT = 'ACL_MODULE_CONFIG_CONSTANT';
export const ACL_CONFIG_PREFIX = 'acl';

export const KEY__ENABLED = createKey<boolean>('enabled', Boolean, { defaultValue: true });
