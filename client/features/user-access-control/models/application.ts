import { Role } from './role';
import { Permission } from './permission';

export class Application {
  id: number;
  name: string;
  permissions: Permission[];
  admin_role: Role;
}
