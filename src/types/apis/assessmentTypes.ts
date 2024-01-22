import { SubjectAttributes } from "@/types/apis/subjectTypes.ts";
import { Identity, Resource } from "@/types/apis/apiTypes.ts";
import {
  AssessmentQuestionAttributes,
  OptionDetailPayload,
} from "@/types/apis/questionTypes.ts";
import { QuestionType } from "@/constants/question.ts";
import { UserAttributes } from "@/types/apis/userTypes.ts";
import { ResultDisplayMode } from "@/constants/resultDisplayMode.ts";

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
  duration?: number;
  totalMarks?: number;
  passMarks?: number;
  maxAttempts?: number;
  isPublished: boolean;
  subject: Resource<SubjectAttributes>;
  validFrom?: Date | null;
  validTo?: Date | null;
  groupIds?: number[];
  questions: Array<AssessmentQuestionAttributes & Identity>;
  requiredMark: boolean;
  resultDisplayMode: keyof typeof ResultDisplayMode;
  publishedAt?: Date;
}

export interface CreateAssessmentParams {
  name: string;
  duration?: number;
  passMarks?: number;
  totalMarks?: number;
  maxAttempts?: number;
  description?: string;
  questions: Pick<AssessmentQuestionAttributes & Identity, "id" | "marks">[];
  subjectId: number;
  validFrom?: Date | null;
  validTo?: Date | null;
  isPublished: boolean;
  groupIds?: number[];
  requiredMark: boolean;
  resultDisplayMode?: string;
}

export interface AssessmentAttributes {
  name: string;
  description?: string;
  thumbnail?: string;
  isPublished: boolean;
  totalQuestions: number;
  subject: Resource<SubjectAttributes>;
  startedAt?: Date;
  publishedAt?: Date;
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
  ownerId: number;
  questions: Array<QuestionResultPayload>;
  requiredMark: boolean;
}

export interface QuestionResultPayload {
  id: number;
  assessmentQuestionId: number;
  content: string | JSX.Element | JSX.Element[];
  type: keyof typeof QuestionType;
  options?: Resource<OptionDetailPayload>[];
  marks: number;
  correctAnswer?: string;
  userAnswer?: number | number[] | string | null;
  isCorrect?: boolean;
  explanation?: string;
  userMarks?: number;
  comment?: string;
}

export interface AssessmentResultPayload {
  assessmentId: string;
  name: string;
  thumbnail?: string;
  startedAt: Date;
  user?: Resource<UserAttributes>;
  score?: number;
  totalMarks?: number;
  passed?: boolean;
  requiredMark?: boolean;
  displayMode?: keyof typeof ResultDisplayMode;
  marked?: boolean;
  fromOwner?: boolean;
}

export interface UpdateAssessmentAttemptAnswerMarkParams {
  marks?: number | null;
  comment?: string;
}

export interface UpdateAssessmentAttemptAnswerMarkPayload {
  marks: number;
}
