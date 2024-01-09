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
