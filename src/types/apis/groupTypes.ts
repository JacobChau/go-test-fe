export interface GroupAttributes {
    name: string;
    description?: string;
    memberCount: number;
    createdBy?: GroupOwnerAttributes;
    createdAt: string;
}

export interface GroupOwnerAttributes {
    name: string;
    email: string;
    avatar?: string;
}

export interface CreateGroupParams {
    name: string;
    description?: string;
}

export interface UpdateGroupParams {
    name?: string;
    description?: string;
}

export type GroupDetailPayload = Pick<GroupAttributes, 'name' | 'description'>;