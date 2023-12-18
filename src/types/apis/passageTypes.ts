export interface PassageAttributes {
    title: string;
    content: string;
}

export type PassagesPayload = Pick<PassageAttributes, 'title'>;

export type PassageDetailPayload = Pick<PassageAttributes, 'title' | 'content'>;

export type CreatePassageParams = Pick<PassageAttributes, 'title' | 'content'>;

export type UpdatePassageParams = Pick<PassageAttributes, 'title' | 'content'>;