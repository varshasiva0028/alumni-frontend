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
  subject: string; // Acts as "Department" for Non-Teaching Staff
  currentRole: string; // Acts as "Designation" for Non-Teaching Staff
  salary: number;

  // Experience
  hasExperience: boolean;
  experienceYears?: number;
  experienceDetails?: string; // Acts as "Previous Job Role" for Non-Teaching Staff

  // Certificates
  teacherExperienceCertificate?: string; // Serves as Teaching Certificate or Non-Teaching Professional Certificate

  // Languages
  languagesKnown: string[];

  // Status
  visible: boolean;
}