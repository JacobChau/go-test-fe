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
