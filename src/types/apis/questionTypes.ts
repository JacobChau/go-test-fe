import { PassageAttributes } from "@/types/apis/passageTypes.ts";
import { QuestionType } from "@/constants/question.ts";
import { Identity, IdentityOptional, Resource } from "@/types/apis/apiTypes.ts";

export interface OptionAttributes {
  answer?: string;
  isCorrect: boolean;
  blankOrder?: number;
}

export interface ExplanationAttributes {
  content: string;
}

export interface QuestionAttributes {
  content: string;
  type: keyof typeof QuestionType;
  passage: Partial<PassageAttributes>;
  options: OptionAttributes[];
  explanation?: ExplanationAttributes;
}

export interface OptionDetailPayload {
  answer?: string;
  isCorrect?: boolean;
  blankOrder?: number;
}

export interface QuestionDetailPayload {
  content: string;
  type: keyof typeof QuestionType;
  passage: Resource<PassageAttributes>;
  options?: Resource<OptionDetailPayload>[];
  explanation?: Resource<ExplanationAttributes>;
  category: Resource<CategoryAttributes>;
}

export interface AssessmentQuestionAttributes {
    content: string;
    type: keyof typeof QuestionType;
    marks: number;
    order: number | null;
}

export interface UpdateQuestionParams {
  content: string;
  type: string;
  explanation?: ExplanationAttributes & IdentityOptional;
  options?: Array<OptionAttributes & Identity>;
  categoryId: number;
  passageId?: number;
}

export interface CreateQuestionParams {
  content: string;
  type: string;
  explanation?: string;
  options?: OptionParams[];
  categoryId: number;
  passageId?: number;
}

export interface OptionParams {
  isCorrect?: boolean;
  answer?: string;
  blankOrder?: number;
}

export interface CategoryAttributes {
  name: string;
  description: string;
}

export type CategoriesPayload = Pick<CategoryAttributes, "name">;

export type CategoryDetailPayload = Pick<
  CategoryAttributes,
  "name" | "description"
>;

export type CreateCategoryParams = Pick<
  CategoryAttributes,
  "name" | "description"
>;

export type UpdateCategoryParams = Pick<
  CategoryAttributes,
  "name" | "description"
>;
