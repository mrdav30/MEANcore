export class Feature {
    _id: string;
    name: string;
    route: string;
    permissions: Permission[];
}

export class Permission {
    _id: string;
    perm_id: string;
    name: string;
}
