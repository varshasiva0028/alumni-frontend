import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Teacher } from '../../models/teacher.model';
import { TeacherService } from '../../services/teacher.service';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css'
})
export class TeacherComponent implements OnInit {

  teachers$!: Observable<Teacher[]>;
  searchText = '';
  selectedGender = '';
  selectedRole = '';

  // Kept for HTML filters mapping
  teachingRoles: string[] = [
    'Principal',
    'Vice Principal',
    'Headmaster',
    'Headmistress',
    'PG Teacher',
    'UG Teacher',
    'Primary Teacher',
    'Secondary Teacher',
    'Physical Education Teacher',
    'Computer Instructor',
    'Music Teacher',
    'Art Teacher',
    'Dance Teacher'
  ];

  nonTeachingRoles: string[] = [
    'Office Administrator',
    'Administrative Officer',
    'Receptionist',
    'Accountant',
    'Office Assistant',
    'Clerk',
    'Librarian',
    'Lab Assistant'
  ];

  supportRoles: string[] = [
    'School Nurse',
    'Counsellor',
    'Transport Manager',
    'Driver',
    'Security Guard',
    'Housekeeping',
    'Maintenance Staff',
    'Electrician',
    'Plumber',
    'Gardener'
  ];

  constructor(
    private router: Router,
    private teacherService: TeacherService
  ) { }

  ngOnInit(): void {
    this.teachers$ = this.teacherService.getFilteredTeachers();
  }

  getTeachingCount(teachers: Teacher[] | null): number {
    if (!teachers) return 0;
    return teachers.filter(t => this.teachingRoles.includes(t.currentRole)).length;
  }

  getNonTeachingCount(teachers: Teacher[] | null): number {
    if (!teachers) return 0;
    return teachers.filter(t => this.nonTeachingRoles.includes(t.currentRole)).length;
  }

  getTeachingStaff(teachers: Teacher[] | null): Teacher[] {
    if (!teachers) return [];
    return teachers.filter(t => this.teachingRoles.includes(t.currentRole));
  }

  getNonTeachingStaff(teachers: Teacher[] | null): Teacher[] {
    if (!teachers) return [];
    return teachers.filter(t => this.nonTeachingRoles.includes(t.currentRole));
  }
  getSupportStaff(teachers: Teacher[] | null): Teacher[] {
    if (!teachers) return [];
    return teachers.filter(t => this.supportRoles.includes(t.currentRole));
  }

  getSupportCount(teachers: Teacher[] | null): number {
    if (!teachers) return 0;
    return teachers.filter(t => this.supportRoles.includes(t.currentRole)).length;
  }

  addTeacher(): void {
    this.router.navigate(['/add-staff']);
  }

  editTeacher(teacher: Teacher): void {
    this.router.navigate(['/update-staff', teacher.id]);
  }

  viewTeacher(teacher: Teacher): void {
    this.router.navigate(['/staff-details', teacher.id]);
  }

  toggleVisibility(teacher: Teacher): void {
    this.teacherService.toggleVisibility(teacher.id);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.teacherService.searchTeachers(value);
  }

  onGenderChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.teacherService.filterByGender(value);
  }

  onRoleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.teacherService.filterByRole(value);
  }
}