export interface InstitutionStats {
  totalEvents: number;
  status: string;
}

export interface AlumniStats {
  male: number;
  female: number;
}

export interface StudentStats {
  male: number;
  female: number;
}

export interface TeachingStaffStats {
  male: number;
  female: number;
}

export interface NonTeachingStaffStats {
  male: number;
  female: number;
}

export interface DashboardStats {
  institution: InstitutionStats;
  alumni: AlumniStats;
  students: StudentStats;

  teachingStaff: TeachingStaffStats;
  nonTeachingStaff: NonTeachingStaffStats;
}