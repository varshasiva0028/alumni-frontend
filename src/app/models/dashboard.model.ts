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

export interface DashboardStats {
  institution: InstitutionStats;
  alumni: AlumniStats;
  students: StudentStats;
}