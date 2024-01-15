export interface SubjectAttributes {
    name: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateSubjectParams = Pick<SubjectAttributes, 'name'>;

export type UpdateSubjectParams = Pick<SubjectAttributes, 'name'>;