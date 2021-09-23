import { UserGroups, UserGroupInfo } from '@stechy1/diplomka-share';

export const userGroups = (lhs: UserGroups, rhs: UserGroupInfo[]) => {
  if (Object.keys(lhs).length !== rhs.length) {
    return false;
  }

  for (const userGroupInfo of rhs) {
    const id = userGroupInfo.id;
    expect(lhs[id]).toEqual(userGroupInfo);
  }

  return true;
}
