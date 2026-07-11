
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-update-staff',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-teacher.html',
  styleUrl: './update-teacher.css'
})
export class UpdateStaffComponent implements OnInit {
  modalErrorMessage = '';
  availableLanguages: string[] = ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];

  isTeachingStaff = true;
  staffId!: number;
  originalVisibility = true;

  // Reactive Form Group matching the official Teacher model
  newTeacherForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
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

    salary: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),

    hasExperience: new FormControl<boolean>(false),
    experienceYears: new FormControl<number | null>(null),
    experienceDetails: new FormControl(''),
    teacherExperienceCertificate: new FormControl(''),

    // Non-Teaching specific fields
    nonTeachingDepartment: new FormControl(''),
    nonTeachingDesignation: new FormControl(''),
    nonTeachingQualification: new FormControl(''),
    nonTeachingSalary: new FormControl<number | null>(null),
    nonTeachingHasExperience: new FormControl<boolean>(false),
    nonTeachingExperienceYears: new FormControl<number | null>(null),
    nonTeachingPreviousJobRole: new FormControl(''),
    nonTeachingCertificate: new FormControl(''),

    languages: new FormArray([])
  });

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

  // Teaching Roles
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

  // Non-Teaching Roles
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

  // Non-Teaching Departments
  departments = [
    'Administration',
    'Accounts',
    'Library',
    'Laboratory',
    'Transport',
    'IT Support',
    'Maintenance',
    'Security',
    'Housekeeping',
    'Reception',
    'Hostel',
    'Medical',
    'Sports',
    'Office',
    'Other'
  ];

  // Non-Teaching Designations
  designations = [
    'Administrative Officer',
    'Office Assistant',
    'Office Clerk',
    'Receptionist',
    'Accountant',
    'Cashier',
    'Store Keeper',
    'Librarian',
    'Assistant Librarian',
    'Lab Assistant',
    'Computer Lab Assistant',
    'System Administrator',
    'IT Support Executive',
    'Network Administrator',
    'Driver',
    'Transport Coordinator',
    'Security Guard',
    'Security Supervisor',
    'Housekeeping Staff',
    'Cleaner',
    'Electrician',
    'Plumber',
    'Maintenance Technician',
    'Gardener',
    'Office Attender',
    'Nurse',
    'Cook',
    'Helper',
    'Warden',
    'Other'
  ];

  // Non-Teaching Qualifications
  qualifications = [
    'SSLC (10th)',
    'HSC (12th)',
    'ITI',
    'Diploma',
    'B.A.',
    'B.Sc.',
    'B.Com.',
    'BBA',
    'BCA',
    'B.E.',
    'B.Tech.',
    'M.A.',
    'M.Sc.',
    'M.Com.',
    'MBA',
    'MCA',
    'M.E.',
    'M.Tech.',
    'Other'
  ];

  // Non-Teaching Previous Job Roles
  previousJobRoles = [
    'Administrative Officer',
    'Office Assistant',
    'Receptionist',
    'Accountant',
    'Cashier',
    'Librarian',
    'Lab Assistant',
    'Computer Operator',
    'IT Support',
    'System Administrator',
    'Driver',
    'Security Guard',
    'Housekeeping Staff',
    'Maintenance Technician',
    'Electrician',
    'Plumber',
    'Store Keeper',
    'Office Clerk',
    'Nurse',
    'Cook',
    'Helper',
    'Other'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private teacherService: TeacherService
  ) { }

  ngOnInit(): void {
    this.staffId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.staffId) {
      alert('Invalid staff ID.');
      this.back();
      return;
    }

    const staff = this.teacherService.getTeacherById(this.staffId);
    if (!staff) {
      alert('Staff profile not found.');
      this.back();
      return;
    }

    this.originalVisibility = staff.visible;

    // Split Name
    const nameParts = (staff.name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Check if Teaching Staff
    this.isTeachingStaff = this.teachingRoles.includes(staff.currentRole);

    // Format DOB for HTML date input (YYYY-MM-DD)
    let dobString = '';
    if (staff.dateOfBirth) {
      const dob = new Date(staff.dateOfBirth);
      const year = dob.getFullYear();
      const month = String(dob.getMonth() + 1).padStart(2, '0');
      const day = String(dob.getDate()).padStart(2, '0');
      dobString = `${year}-${month}-${day}`;
    }

    // Dynamic setups for Qualification & Subject dropdowns vs 'Other' input
    let qualValue = staff.qualification;
    let qualOtherValue = '';
    if (this.isTeachingStaff && !this.bachelors.includes(qualValue) && !this.masters.includes(qualValue)) {
      qualValue = 'Other';
      qualOtherValue = staff.qualification;
    }

    let subjValue = staff.subject ?? '';
    let subjOtherValue = '';
   if (
  this.isTeachingStaff &&
  !this.subjects.includes(subjValue)
) {
  subjValue = 'Other';
  subjOtherValue = staff.subject ?? '';
}
    // Set toggle state
    this.setEmploymentCategory(this.isTeachingStaff);

    // Pre-fill reactive form values
    this.newTeacherForm.patchValue({
      firstName: firstName,
      lastName: lastName,
      photo: staff.photo,
      gender: staff.gender,
      phoneNumber: staff.phoneNumber,
      dateOfBirth: dobString,
      bloodGroup: staff.bloodGroup || '',
      email: staff.email || '',
      aadhaar: staff.aadhaarNumber || '',
      address: staff.address
    });

    if (this.isTeachingStaff) {
      this.newTeacherForm.patchValue({
        currentRole: staff.currentRole,
        qualification: qualValue,
        qualificationOther: qualOtherValue,
        subject: subjValue,
        subjectOther: subjOtherValue,
        salary: staff.salary,
        hasExperience: staff.hasExperience,
        experienceYears: staff.experienceYears || null,
        experienceDetails: staff.experienceDetails || '',
        teacherExperienceCertificate: staff.teacherExperienceCertificate || ''
      });
    } else {
      this.newTeacherForm.patchValue({
        nonTeachingDepartment: staff.subject,
        nonTeachingDesignation: staff.currentRole,
        nonTeachingQualification: staff.qualification,
        nonTeachingSalary: staff.salary,
        nonTeachingHasExperience: staff.hasExperience,
        nonTeachingExperienceYears: staff.experienceYears || null,
        nonTeachingPreviousJobRole: staff.experienceDetails || '',
        nonTeachingCertificate: staff.teacherExperienceCertificate || ''
      });
    }

    // Pre-fill languages array
    const arr = this.languagesFormArray;
    arr.clear();
    if (staff.languagesKnown) {
      staff.languagesKnown.forEach(lang => {
        arr.push(new FormControl(lang));
      });
    }

    // Subscribe to dynamic form switches
    this.setupChangeSubscriptions();
  }

  setupChangeSubscriptions(): void {
    // Qualification -> Other
    this.newTeacherForm.get('qualification')?.valueChanges.subscribe(value => {
      const other = this.newTeacherForm.get('qualificationOther');
      if (this.isTeachingStaff && value === 'Other') {
        other?.setValidators([Validators.required]);
      } else {
        other?.clearValidators();
        other?.setValue('');
      }
      other?.updateValueAndValidity();
    });

    // Subject -> Other
    this.newTeacherForm.get('subject')?.valueChanges.subscribe(value => {
      const other = this.newTeacherForm.get('subjectOther');
      if (this.isTeachingStaff && value === 'Other') {
        other?.setValidators([Validators.required]);
      } else {
        other?.clearValidators();
        other?.setValue('');
      }
      other?.updateValueAndValidity();
    });

    // Experience -> Certificate, Years & Details (Teaching Staff)
    this.newTeacherForm.get('hasExperience')?.valueChanges.subscribe(value => {
      const years = this.newTeacherForm.get('experienceYears');
      const details = this.newTeacherForm.get('experienceDetails');
      const certificate = this.newTeacherForm.get('teacherExperienceCertificate');
      if (this.isTeachingStaff && value) {
        years?.setValidators([Validators.required, Validators.min(1)]);
        details?.setValidators([Validators.required]);
        certificate?.setValidators([Validators.required]);
      } else {
        years?.clearValidators();
        years?.setValue(null);
        details?.clearValidators();
        details?.setValue('');
        certificate?.clearValidators();
        certificate?.setValue('');
      }
      years?.updateValueAndValidity();
      details?.updateValueAndValidity();
      certificate?.updateValueAndValidity();
    });

    // Experience -> Certificate, Years & Details (Non-Teaching Staff)
    this.newTeacherForm.get('nonTeachingHasExperience')?.valueChanges.subscribe(value => {
      const years = this.newTeacherForm.get('nonTeachingExperienceYears');
      const prevRole = this.newTeacherForm.get('nonTeachingPreviousJobRole');
      if (!this.isTeachingStaff && value) {
        years?.setValidators([Validators.required, Validators.min(1)]);
        prevRole?.setValidators([Validators.required]);
      } else {
        years?.clearValidators();
        years?.setValue(null);
        prevRole?.clearValidators();
        prevRole?.setValue('');
      }
      years?.updateValueAndValidity();
      prevRole?.updateValueAndValidity();
    });
  }

  setEmploymentCategory(isTeaching: boolean): void {
    this.isTeachingStaff = isTeaching;

    // Clear and set validators dynamically based on role type
    const qualification = this.newTeacherForm.get('qualification');
    const subject = this.newTeacherForm.get('subject');
    const currentRole = this.newTeacherForm.get('currentRole');
    const salary = this.newTeacherForm.get('salary');

    const ntDept = this.newTeacherForm.get('nonTeachingDepartment');
    const ntDesig = this.newTeacherForm.get('nonTeachingDesignation');
    const ntQual = this.newTeacherForm.get('nonTeachingQualification');
    const ntSalary = this.newTeacherForm.get('nonTeachingSalary');

    if (isTeaching) {
      qualification?.setValidators([Validators.required]);
      subject?.setValidators([Validators.required]);
      currentRole?.setValidators([Validators.required]);
      salary?.setValidators([Validators.required, Validators.min(0)]);

      ntDept?.clearValidators();
      ntDesig?.clearValidators();
      ntQual?.clearValidators();
      ntSalary?.clearValidators();
    } else {
      qualification?.clearValidators();
      subject?.clearValidators();
      currentRole?.clearValidators();
      salary?.clearValidators();

      ntDept?.setValidators([Validators.required]);
      ntDesig?.setValidators([Validators.required]);
      ntQual?.setValidators([Validators.required]);
      ntSalary?.setValidators([Validators.required, Validators.min(0)]);
    }

    // Update form validity
    qualification?.updateValueAndValidity();
    subject?.updateValueAndValidity();
    currentRole?.updateValueAndValidity();
    salary?.updateValueAndValidity();

    ntDept?.updateValueAndValidity();
    ntDesig?.updateValueAndValidity();
    ntQual?.updateValueAndValidity();
    ntSalary?.updateValueAndValidity();
  }

  get languagesFormArray(): FormArray {
    return this.newTeacherForm.get('languages') as FormArray;
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

  onExperienceCertificateUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.modalErrorMessage = 'Experience certificate must be less than 5 MB.';
      return;
    }

    this.newTeacherForm.patchValue({
      teacherExperienceCertificate: file.name
    });
  }

  onNonTeachingCertificateUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.modalErrorMessage = 'Professional certificate must be less than 5 MB.';
      return;
    }

    this.newTeacherForm.patchValue({
      nonTeachingCertificate: file.name
    });
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
    const fullName = `${val.firstName} ${val.lastName}`.trim();
    this.modalErrorMessage = '';

    let qualification = '';
    let subject = '';
    let role = '';
    let salary = 0;
    let hasExperience = false;
    let expYears: number | undefined = undefined;
    let expDetails: string | undefined = undefined;
    let certificate = '';

    if (this.isTeachingStaff) {
      qualification = (val.qualification === 'Other' ? val.qualificationOther : val.qualification) || '';
      subject = (val.subject === 'Other' ? val.subjectOther : val.subject) || '';
      role = val.currentRole || '';
      salary = Number(val.salary || 0);
      hasExperience = !!val.hasExperience;
      expYears = val.hasExperience ? Number(val.experienceYears || 0) : undefined;
      expDetails = val.hasExperience ? (val.experienceDetails || undefined) : undefined;
      certificate = val.teacherExperienceCertificate || '';
    } else {
      qualification = val.nonTeachingQualification || '';
      subject = val.nonTeachingDepartment || '';
      role = val.nonTeachingDesignation || '';
      salary = Number(val.nonTeachingSalary || 0);
      hasExperience = !!val.nonTeachingHasExperience;
      expYears = val.nonTeachingHasExperience ? Number(val.nonTeachingExperienceYears || 0) : undefined;
      expDetails = val.nonTeachingHasExperience ? (val.nonTeachingPreviousJobRole || undefined) : undefined;
      certificate = val.nonTeachingCertificate || '';
    }

    this.teacherService.updateTeacher({
      id: this.staffId,

      // Personal
      name: fullName,
      photo:
        val.photo ||
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      gender: val.gender as 'Male' | 'Female' | 'Other',
      phoneNumber: (val.phoneNumber || '').trim(),
      email: val.email || undefined,
      bloodGroup: val.bloodGroup || undefined,
      address: (val.address || '').trim(),
      aadhaarNumber: val.aadhaar || undefined,
      dateOfBirth: val.dateOfBirth ? new Date(val.dateOfBirth) : new Date(),

      // NEW REQUIRED FIELDS
      employmentCategory: this.isTeachingStaff ? 'Teaching' : 'Non-Teaching',

      department: this.isTeachingStaff
        ? subject.trim()
        : (val.nonTeachingDepartment || '').trim(),

      // Professional
      qualification: qualification.trim(),
      subject: subject.trim(),
      currentRole: role,
      salary,

      // Experience
      hasExperience,
      experienceYears: expYears,
      experienceDetails: expDetails,
      teacherExperienceCertificate: certificate,

      // Languages
      languagesKnown: (val.languages as string[]) || [],

      // Status
      visible: this.originalVisibility
    });

    alert('Staff profile updated successfully!');
    this.back();
  }

  back(): void {
    this.location.back();
  }
}




