export type UserRole = 'student' | 'organization' | 'admin';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}