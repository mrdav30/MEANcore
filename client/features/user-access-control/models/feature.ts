export class Feature {
    _id: string;
    name: string;
    route: string;
    order_priority: number;
    permissions: Permission[];
}

export class Permission {
    _id: string;
    perm_id: string;
    name: string;
}
