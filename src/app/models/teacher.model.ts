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

  // Professional Information
  qualification: string;
  subject:string;
  currentRole: string;
  salary: number;

  // Experience
  hasExperience: boolean;
  experienceYears?: number;
  experienceDetails?: string;

  // Languages
  languagesKnown: string[];

  // Status
  visible: boolean;
}