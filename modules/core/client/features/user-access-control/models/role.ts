import { Feature } from './feature';
import { User } from './user';

export class Role {
  _id: string;
  name: string;
  features: Feature[];
  users: User[];
}
