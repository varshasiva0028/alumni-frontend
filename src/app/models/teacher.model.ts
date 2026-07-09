export interface Teacher {
  id: number;

  // Personal Information
  photo: string;
  name: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  email?: string;
  bloodGroup?: string;
  address: string;
  aadhaarNumber?: string;

  // Employment
  employmentCategory: 'Teaching' | 'Non-Teaching' | 'Support';

  // Professional Information
  qualification: string;
  department: string;
  currentRole: string;
  salary: number;

  // Teaching Only
  subject?: string;

  // Experience
  hasExperience: boolean;
  experienceYears?: number;
  experienceDetails?: string;

  // Certificate
  teacherExperienceCertificate?: string;

  // Languages
  languagesKnown: string[];

  // Status
  visible: boolean;
}