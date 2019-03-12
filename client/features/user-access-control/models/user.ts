import { Application } from './application';

export class User {
  id: number;
  name: string;
  full_name: string;
  email: string;
  admin: boolean;
  apps: Application[];
  supervisor_id: number;
  supervisor_name: string;
  supervisor_chain: User[];
}
