import SubmissionStatus from "@/core/submission/domain/value-objects/SubmissionStatus.vo";

export interface CorrectLessonResponse {
  submissionId: string;
  repositoryUrl: string;
  grade: number;
  status: SubmissionStatus;
}
