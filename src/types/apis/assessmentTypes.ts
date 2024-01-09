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
import { OptionDetailPayload } from "@/types/apis/questionTypes.ts";
import { Resource } from "@/types/apis/apiTypes.ts";

export interface AssessmentAttributes {
  name: string;
  description?: string;
  thumbnail?: string;
  isPublished: boolean;
  totalQuestions: number;
}

export interface AssessmentDetailPayload {
  name: string;
  description?: string;
  thumbnail?: string;
  totalQuestions: number;
  totalMarks: number;
  passMarks?: number;
  maxAttempts: number;
  duration: number;
  validFrom?: string;
  validTo?: string;
  isPublished: boolean;
}

export interface CreateAssessmentAttemptParams {
  assessmentId: string;
}

export interface CreateAssessmentAttemptPayload {
  canStart: boolean;
  attemptId: number;
}

interface UserAnswer {
  questionId: number;
  answer: Array<number> | string;
}

export interface SubmitAssessmentAttemptParams {
  attemptId: number;
  answers: UserAnswer[];
}

export interface SubmitAssessmentAttemptPayload {
  totalMarks: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface AssessmentResultPayload {
  name: string;
  score: number;
  totalMarks: number;
  totalCorrect: number;
  totalQuestions: number;
  questions: Array<QuestionResultPayload>;
}

export interface QuestionResultPayload {
  content: string;
  type: string;
  options?: Resource<OptionDetailPayload>[];
  marks: number;
  correctAnswer?: string;
  userAnswer?: string;
  isCorrect?: boolean;
  explanation?: string;
}
