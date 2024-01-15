import { SubjectAttributes } from "@/types/apis/subjectTypes.ts";
import { Identity, Resource } from "@/types/apis/apiTypes.ts";
import {
  AssessmentQuestionAttributes,
  OptionDetailPayload,
} from "@/types/apis/questionTypes.ts";
import { QuestionType } from "@/constants/question.ts";

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
  description?: string;
  thumbnail?: string;
  totalQuestions?: number;
  duration: number;
  totalMarks: number;
  passMarks?: number;
  maxAttempts?: number;
  isPublished: boolean;
  subject: Resource<SubjectAttributes>;
  validFrom?: Date | null;
  validTo?: Date | null;
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
  questions: Pick<AssessmentQuestionAttributes & Identity, "id" | "marks">[];
  subjectId: number;
  validFrom?: Date | null;
  validTo?: Date | null;
  isPublished: boolean;
  groupIds?: number[];
}

export interface AssessmentAttributes {
  name: string;
  description?: string;
  thumbnail?: string;
  isPublished: boolean;
  totalQuestions: number;
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

export interface AssessmentResultDetailPayload {
  name: string;
  score: number;
  totalMarks: number;
  totalCorrect: number;
  totalQuestions: number;
  questions: Array<QuestionResultPayload>;
}

export interface QuestionResultPayload {
  id: number;
  content: string | JSX.Element | JSX.Element[];
  type: keyof typeof QuestionType;
  options?: Resource<OptionDetailPayload>[];
  marks?: number;
  correctAnswer?: string;
  userAnswer?: number | number[] | string | null;
  isCorrect?: boolean;
  explanation?: string;
}

export interface AssessmentResultPayload {
  assessmentId: string;
  name: string;
  thumbnail?: string;
  score: number;
  totalMarks: number;
  passed: boolean;
  startedAt: Date;
}
