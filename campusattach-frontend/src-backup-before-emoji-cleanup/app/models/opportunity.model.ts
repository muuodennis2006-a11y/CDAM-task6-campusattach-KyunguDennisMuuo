export type OpportunityType = 'Attachment' | 'Internship';

export type OpportunityStatus = 'Open' | 'Closed';

export interface Opportunity {
  id: number;
  title: string;
  organizationName: string;
  type: OpportunityType;
  location: string;
  description: string;
  requirements: string[];
  deadline: string;
  status: OpportunityStatus;
  postedDate: string;
}