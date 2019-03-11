import { Application } from './application';
import { User } from './user';

export class Role {
  id: number;
  name: string;
  apps: Application[];
  users: User[];
}
