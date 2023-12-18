import {PassageAttributes} from "@/types/apis/passageTypes.ts";

export interface OptionAttributes {
    answer: string;
    isCorrect: boolean;
}

export interface ExplanationAttributes {
    content: string;
}

export interface QuestionAttributes  {
    content: string;
    type: string;
    passage: Partial<PassageAttributes>;
    options: OptionAttributes[];
}

export interface CreateQuestionParams {
    content: string;
    type: string;
    explanation?: ExplanationAttributes;
    options: OptionParams[];
    categoryId: string;
    passageId?: string;
}

export interface OptionParams {
    isCorrect?: boolean;
    answer: string;
    blankOrder?: number;
}

export interface CategoryAttributes {
    name: string;
    description: string;
}

export type CategoriesPayload = Pick<CategoryAttributes, 'name'>;

export type CategoryDetailPayload = Pick<CategoryAttributes, 'name' | 'description'>;

export type CreateCategoryParams = Pick<CategoryAttributes, 'name' | 'description'>;

export type UpdateCategoryParams = Pick<CategoryAttributes, 'name' | 'description'>;