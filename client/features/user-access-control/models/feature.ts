import { Permission } from './permission';

export class Feature {
    _id: string;
    name: string;
    route: string;
    permissions: Permission[];
}
