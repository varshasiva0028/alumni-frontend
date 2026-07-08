import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Teacher } from '../../models/teacher.model';
import { TeacherService } from '../../services/teacher.service';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css'
})
export class TeacherComponent implements OnInit {

  teachers$!: Observable<Teacher[]>;
  searchText = '';
  selectedGender = '';
  selectedRole = '';

  // Add modal state variables
  isAddModalOpen = false;
  modalErrorMessage = '';
  availableLanguages: string[] = ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];

  // Reactive Form Group setup matching the official Teacher model properties
  newTeacherForm = new FormGroup({
    name: new FormControl('', Validators.required),
    photo: new FormControl(''),
    gender: new FormControl('', Validators.required),
    currentRole: new FormControl('', Validators.required),

    qualification: new FormControl('', Validators.required),
    qualificationOther: new FormControl(''),

    subject: new FormControl('', Validators.required),
    subjectOther: new FormControl(''),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[6-9]\d{9}$/)
    ]),
    dateOfBirth: new FormControl('', Validators.required),
    bloodGroup: new FormControl(''),
    email: new FormControl(''),
    aadhaar: new FormControl(''),
    address: new FormControl('', Validators.required),

    salary: new FormControl<number | null>(
      null,
      [Validators.required, Validators.min(0)]
    ),

    hasExperience: new FormControl<boolean>(false),
    experienceYears: new FormControl<number | null>(null),
    experienceDetails: new FormControl(''),

    languages: new FormArray([])
  });
  constructor(
    private router: Router,
    private teacherService: TeacherService
  ) { }

  ngOnInit(): void {

    this.teachers$ = this.teacherService.getFilteredTeachers();

    this.newTeacherForm.get('qualification')?.valueChanges.subscribe(value => {

      const other = this.newTeacherForm.get('qualificationOther');

      if (value === 'Other') {
        other?.setValidators([Validators.required]);
      } else {
        other?.clearValidators();
        other?.setValue('');
      }

      other?.updateValueAndValidity();

    });

    this.newTeacherForm.get('subject')?.valueChanges.subscribe(value => {

      const other = this.newTeacherForm.get('subjectOther');

      if (value === 'Other') {
        other?.setValidators([Validators.required]);
      } else {
        other?.clearValidators();
        other?.setValue('');
      }

      other?.updateValueAndValidity();

    });

  }
  addTeacher(): void {
    this.openAddModal();
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

  // Bachelor's Degrees
  bachelors: string[] = [
    'B.A.',
    'B.Sc.',
    'B.Com.',
    'B.Ed.',
    'B.El.Ed.',
    'B.Tech.',
    'B.E.',
    'BCA',
    'BBA',
    'B.P.Ed.',
    'BFA',
    'Bachelor of Music',
    'BSW',
    'B.Lib.I.Sc.',
    'Other'
  ];

  // Master's Degrees
  masters: string[] = [
    'M.A.',
    'M.Sc.',
    'M.Com.',
    'M.Ed.',
    'MBA',
    'MCA',
    'M.Tech.',
    'M.E.',
    'M.P.Ed.',
    'MFA',
    'Master of Music',
    'MSW',
    'M.Lib.I.Sc.',
    'M.Phil.',
    'Ph.D.',
    'Other'
  ];

  subjects = [
    'Tamil',
    'English',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Botany',
    'Zoology',
    'Computer Science',
    'Information Technology',
    'Commerce',
    'Accountancy',
    'Business Mathematics',
    'Economics',
    'History',
    'Geography',
    'Political Science',
    'Civics',
    'Social Science',
    'Environmental Science',
    'General Science',
    'Physical Education',
    'Yoga',
    'Music',
    'Dance',
    'Fine Arts',
    'Drawing',
    'Library Science',
    'Psychology',
    'Special Education',
    'Montessori Education',
    'Kindergarten',
    'Primary Education',
    'Other'
  ];


  // ===============================
  // Teaching Staff
  // ===============================
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

  // ===============================
  // Non-Teaching Staff
  // ===============================
  nonTeachingRoles: string[] = [
    'Office Administrator',
    'Administrative Officer',
    'Receptionist',
    'Accountant',
    'Office Assistant',
    'Clerk',
    'Librarian',
    'Lab Assistant',
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

  // --- Modal Form & FormArray Helpers ---
  get languagesFormArray(): FormArray {
    return this.newTeacherForm.get('languages') as FormArray;
  }

  openAddModal(): void {
    this.modalErrorMessage = '';
    this.newTeacherForm.reset({
      name: '',
      photo: '',
      gender: '',
      currentRole: '',
      qualification: '',
      qualificationOther: '',
      subject: '',
      subjectOther: '',
      phoneNumber: '',
      dateOfBirth: '',
      bloodGroup: '',
      email: '',
      aadhaar: '',
      address: '',
      salary: null,
      hasExperience: false,
      experienceYears: null,
      experienceDetails: ''
    });
    // Clear FormArray controls
    const arr = this.languagesFormArray;
    while (arr.length) {
      arr.removeAt(0);
    }
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  onPhotoUploaded(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      this.modalErrorMessage = 'Invalid photo format. Allowed: JPG, JPEG, PNG, WEBP.';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.modalErrorMessage = 'Photo exceeds 5 MB size limit.';
      return;
    }

    this.modalErrorMessage = '';
    const reader = new FileReader();
    reader.onload = () => {
      this.newTeacherForm.patchValue({ photo: reader.result as string });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  toggleLanguage(lang: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const arr = this.languagesFormArray;
    if (isChecked) {
      arr.push(new FormControl(lang));
    } else {
      const idx = arr.controls.findIndex(ctrl => ctrl.value === lang);
      if (idx !== -1) {
        arr.removeAt(idx);
      }
    }
  }

  isLanguageSelected(lang: string): boolean {
    return this.languagesFormArray.value.includes(lang);
  }

  submitTeacherForm(): void {
    if (this.newTeacherForm.invalid) {
      this.modalErrorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    const val = this.newTeacherForm.value;
    this.modalErrorMessage = '';
    const qualification =
      val.qualification === 'Other'
        ? val.qualificationOther
        : val.qualification;

    const subject =
      val.subject === 'Other'
        ? val.subjectOther
        : val.subject;

    // Fetch next auto-incremented ID
    const nextId = this.teacherService.getNextTeacherId();

    // Add new teacher profile details matching type constraints of your Teacher interface
    this.teacherService.addTeacher({
      id: nextId,
      name: (val.name || '').trim(),
      photo: val.photo || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      gender: val.gender as 'Male' | 'Female' | 'Other',
      visible: true,
      currentRole: val.currentRole || '',
      qualification: qualification?.trim() || '',
      subject: subject?.trim() || '',
      phoneNumber: (val.phoneNumber || '').trim(),
      dateOfBirth: val.dateOfBirth ? new Date(val.dateOfBirth) : new Date(),
      bloodGroup: val.bloodGroup || undefined,
      email: val.email || undefined,
      aadhaarNumber: val.aadhaar || undefined,
      address: (val.address || '').trim(),
      salary: Number(val.salary || 0),
      hasExperience: !!val.hasExperience,
      experienceYears: val.hasExperience ? Number(val.experienceYears || 0) : undefined,
      experienceDetails: val.hasExperience ? (val.experienceDetails || undefined) : undefined,
      languagesKnown: (val.languages as string[]) || []
    });

    alert('Teacher added successfully!');
    this.closeAddModal();
  }
}