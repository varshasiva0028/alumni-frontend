export interface AlumniModel {
  id: number;
  name: string;
  gender: 'male' | 'female';
  batch: number;
  phone: string;
  classStudied: string;
  email: string;
  occupation: string;
  address: string;
  photo: string;
}

export interface AlumniState {
  alumniList: AlumniModel[];
  searchText: string;
  viewType: 'grid' | 'list';
  maleCount: number;
  femaleCount: number;
}