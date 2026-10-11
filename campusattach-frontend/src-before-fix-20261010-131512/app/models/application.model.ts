export type ApplicationStatus =
  | 'Pending'
  | 'Shortlisted'
  | 'Accepted'
  | 'Rejected';

export interface Application {
  id: number;
  opportunityId: number;
  opportunityTitle: string;
  organizationName: string;
  studentName: string;
  appliedDate: string;
  status: ApplicationStatus;
}