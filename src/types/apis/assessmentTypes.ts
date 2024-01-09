import {SubjectAttributes} from "@/types/apis/subjectTypes.ts";
import {Identity, Resource} from "@/types/apis/apiTypes.ts";
import {AssessmentQuestionAttributes} from "@/types/apis/questionTypes.ts";

export interface AssessmentAttributes {
    name: string;
    duration: number;
    totalMark: number;
    description?: string;
    questions: AssessmentQuestionAttributes[];
    subject: Resource<SubjectAttributes>;
    groupIds?: number[];
}


export interface AssessmentDetailPayload {
    name: string;
    duration: number;
    totalMarks: number;
    passMarks?: number;
    description?: string;
    maxAttempts?: number;
    validFrom?: Date | null;
    validTo?: Date | null;
    subjectId: string;
    isPublished: boolean;
    groupIds?: number[];
    questions: Array<AssessmentQuestionAttributes & Identity>;
}


export interface CreateAssessmentParams {
    name: string;
    duration?: number;
    passMarks?: number;
    totalMarks: number;
    maxAttempts?: number;
    description?: string;
    questions: Pick<AssessmentQuestionAttributes & Identity, 'id' | 'marks'>[];
    subjectId: number;
    validFrom?: Date | null;
    validTo?: Date | null;
    isPublished: boolean;
    groupIds?: number[];
}