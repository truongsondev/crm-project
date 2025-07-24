import { User } from '@app/interfaces/user.interface';

export function getManagerName(
  id: string | undefined,
  employees: User[] | null,
) {
  const manager = employees?.find((u) => u._id == id);
  if (!manager) return null;
  return manager.first_name + ' ' + manager?.last_name;
}
