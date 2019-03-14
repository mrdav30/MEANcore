import { Permission } from './permission';
import { User } from './user';

export class Role {
  _id: string;
  name: string;
  permissions: Permission[];
  users: User[];
}
