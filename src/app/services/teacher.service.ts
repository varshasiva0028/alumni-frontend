import { Injectable } from '@angular/core';
import { Teacher } from '../models/teacher.model';
import { combineLatest, map, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TeacherService {

    constructor() { }

    // ===========================================
    // DUMMY DATA BUILDER
    // ===========================================
    private createTeacher(
        id: number,
        photo: string | number,
        name: string,
        dateOfBirth: Date,
        gender: 'Male' | 'Female' | 'Other',
        phoneNumber: string,
        email: string,
        bloodGroup: string,
        address: string,
        aadhaarNumber: string,

        employmentCategory: 'Teaching' | 'Non-Teaching' | 'Support',
        department: string,

        qualification: string,
        subject: string,
        currentRole: string,
        salary: number,

        hasExperience: boolean,
        experienceYears: number,
        experienceDetails: string,
        teacherExperienceCertificate: string,

        languagesKnown: string[]
    ): Teacher {

        return {
            id,

            // Personal
            photo: typeof photo === 'number' ? `https://i.pravatar.cc/400?img=${photo}` : photo,
            name,
            dateOfBirth,
            gender,
            phoneNumber,
            email,
            bloodGroup,
            address,
            aadhaarNumber,

            // Employment
            employmentCategory,
            department,

            // Professional
            qualification,
            subject,
            currentRole,
            salary,

            // Experience
            hasExperience,
            experienceYears,
            experienceDetails,
            teacherExperienceCertificate,

            // Languages
            languagesKnown,

            // Status
            visible: true
        };
    }

    private teachers: Teacher[] = [
        // --- Teaching Faculty Mock Data ---
        this.createTeacher(
            1,
            11,
            'R. Meenakshi',
            new Date('1984-05-12'),
            'Female',
            '9876543210',
            'meenakshi@school.edu',
            'O+',
            'Chennai',
            '123456789012',

            'Teaching',
            'Administration',

            'M.Ed',
            'Tamil',
            'Principal',
            85000,

            true,
            22,
            'Academic Administration',
            'experience-certificate.pdf',

            ['Tamil', 'English']
        ),

        this.createTeacher(
            2,
            12,
            'S. Prakash',
            new Date('1986-07-18'),
            'Male',
            '9876543211',
            'prakash@school.edu',
            'B+',
            'Madurai',
            '123456789013',

            'Teaching',
            'Mathematics',

            'M.Sc',
            'Mathematics',
            'PG Teacher',
            52000,

            true,
            12,
            'Higher Secondary Mathematics',
            'experience-certificate.pdf',

            ['Tamil', 'English']
        ),

        this.createTeacher(
            3,
            13,
            'K. Revathi',
            new Date('1990-02-25'),
            'Female',
            '9876543212',
            'revathi@school.edu',
            'A+',
            'Coimbatore',
            '123456789014',

            'Teaching',
            'English',

            'M.A',
            'English',
            'UG Teacher',
            48000,

            true,
            8,
            'Spoken English & Literature',
            'experience-certificate.pdf',

            ['Tamil', 'English', 'Hindi']
        ),

        this.createTeacher(
            4,
            14,
            'V. Aravind',
            new Date('1988-11-03'),
            'Male',
            '9876543213',
            'aravind@school.edu',
            'AB+',
            'Salem',
            '123456789015',

            'Teaching',
            'Science',

            'M.Sc',
            'Science',
            'UG Teacher',
            50000,

            true,
            10,
            'Physics & Chemistry',
            'experience-certificate.pdf',

            ['Tamil', 'English']
        ),

        this.createTeacher(
            5,
            15,
            'L. Divya',
            new Date('1992-04-15'),
            'Female',
            '9876543214',
            'divya@school.edu',
            'B-',
            'Trichy',
            '123456789016',

            'Teaching',
            'Primary',

            'B.Ed',
            'English',
            'Primary Teacher',
            35000,

            true,
            5,
            'Primary Education',
            'experience-certificate.pdf',

            ['Tamil', 'English']
        ),

        this.createTeacher(
            6,
            16,
            'M. Karthik',
            new Date('1987-08-08'),
            'Male',
            '9876543215',
            'karthik@school.edu',
            'O-',
            'Erode',
            '123456789017',

            'Teaching',
            'Computer Science',

            'MCA',
            'Computer Science',
            'Computer Instructor',
            56000,

            true,
            11,
            'Programming & Computer Science',
            'experience-certificate.pdf',

            ['Tamil', 'English']
        ),

        this.createTeacher(
            7,
            17,
            'A. Nandhini',
            new Date('1991-10-22'),
            'Female',
            '9876543216',
            'nandhini@school.edu',
            'A-',
            'Vellore',
            '123456789018',

            'Teaching',
            'Physical Education',

            'M.P.Ed',
            'Physical Education',
            'Physical Education Teacher',
            42000,

            true,
            7,
            'Sports & Physical Training',
            'experience-certificate.pdf',

            ['Tamil', 'English']
        ),

        this.createTeacher(
            11,
            21,
            'K. Naveen',
            new Date('2001-08-15'),
            'Male',
            '9876543220',
            'naveen@school.edu',
            'O+',
            'Chennai',
            '123456789022',

            'Teaching',
            'Primary',

            'B.Ed',
            'Mathematics',
            'Primary Teacher',
            25000,

            false,
            0,
            '',
            '',

            ['Tamil', 'English']
        ),

        this.createTeacher(
            12,
            24,
            'S. Ranjith',
            new Date('2001-08-15'),
            'Male',
            '9876543221',
            'ranjith@school.edu',
            'O+',
            'Chennai',
            '',

            'Teaching',
            'Primary',

            'B.Ed',
            'Mathematics',
            'Primary Teacher',
            25000,

            false,
            0,
            '',
            '',

            ['Tamil', 'English']
        ),
        
        // --- Non-Teaching Mock Data ---
        this.createTeacher(
            8,
            18,
            'P. Suresh',
            new Date('1985-01-17'),
            'Male',
            '9876543217',
            'suresh@school.edu',
            'B+',
            'Thanjavur',
            '123456789019',

            'Non-Teaching',
            'Library',

            'Diploma',
            'Library',
            'Librarian',
            40000,
            true,
            15,
            'Librarian',
            'library-certification.pdf',
            ['Tamil', 'English']
        ),

        this.createTeacher(
            9,
            19,
            'J. Priya',
            new Date('1993-06-09'),
            'Female',
            '9876543218',
            'priya@school.edu',
            'AB-',
            'Tirunelveli',
            '123456789020',

            'Non-Teaching',
            'Accounts',

            'B.Com.',
            'Accounts',
            'Accountant',
            45000,
            true,
            6,
            'Accountant',
            'tally-certification.png',
            ['Tamil', 'English', 'Malayalam']
        ),

        this.createTeacher(
            10,
            20,
            'R. Vijay',
            new Date('1989-12-14'),
            'Male',
            '9876543219',
            'vijay@school.edu',
            'O+',
            'Namakkal',
            '123456789021',

            'Non-Teaching',
            'Administration',

            'MBA',
            'Administration',
            'Office Administrator',
            65000,
            true,
            18,
            'Administrative Officer',
            'admin-experience.pdf',
            ['Tamil', 'English', 'Hindi']
        ),

        // ---------- Support Staff ----------
        this.createTeacher(
            13,
            25,
            'D. Kumar',
            new Date('1984-03-18'),
            'Male',
            '9876543223',
            'kumar@school.edu',
            'B+',
            'Chennai',
            '123456789023',

            'Support',
            'Transport',

            'Diploma',
            'Transport',
            'Driver',
            28000,
            true,
            12,
            'School Bus Driver',
            'driving-license.pdf',
            ['Tamil']
        ),

        this.createTeacher(
            14,
            26,
            'S. Lakshmi',
            new Date('1992-11-08'),
            'Female',
            '9876543224',
            'lakshmi@school.edu',
            'O+',
            'Madurai',
            '123456789024',

            'Support',
            'Medical',

            'GNM Nursing',
            'Medical',
            'School Nurse',
            42000,
            true,
            8,
            'Student Health Care',
            'nursing-certificate.pdf',
            ['Tamil', 'English']
        ),

        this.createTeacher(
            15,
            30,
            'R. Mani',
            new Date('1988-07-12'),
            'Male',
            '9876543225',
            'mani@school.edu',
            'A+',
            'Salem',
            '123456789025',

            'Support',
            'Maintenance',

            'ITI Electrician',
            'Maintenance',
            'Electrician',
            35000,
            true,
            10,
            'Electrical Maintenance',
            'electrician-license.pdf',
            ['Tamil']
        ),

        this.createTeacher(
            16,
            28,
            'P. Selvi',
            new Date('1995-09-20'),
            'Female',
            '9876543226',
            'selvi@school.edu',
            'O-',
            'Trichy',
            '123456789026',

            'Support',
            'Housekeeping',

            'SSLC',
            'Housekeeping',
            'Housekeeping',
            22000,
            true,
            5,
            'Campus Cleaning & Hygiene',
            'housekeeping-training.pdf',
            ['Tamil']
        ),

        this.createTeacher(
            17,
            34,
            'M. Ravi',
            new Date('1986-05-27'),
            'Male',
            '9876543227',
            'ravi@school.edu',
            'AB+',
            'Coimbatore',
            '123456789027',

            'Support',
            'Security',

            'Diploma',
            'Security',
            'Security Guard',
            26000,
            true,
            9,
            'Campus Security',
            'security-training.pdf',
            ['Tamil', 'English']
        ),

        this.createTeacher(
            18,
            30,
            'V. Anitha',
            new Date('1991-01-15'),
            'Female',
            '9876543228',
            'anitha@school.edu',
            'A-',
            'Erode',
            '123456789028',

            'Support',
            'Counselling',

            'M.A Psychology',
            'Counselling',
            'Counsellor',
            48000,
            true,
            7,
            'Student Counselling',
            'psychology-certificate.pdf',
            ['Tamil', 'English']
        )
    ];

    // ===========================================
    // STATE MANAGEMENT
    // ===========================================
    private teacherSubject = new BehaviorSubject<Teacher[]>(
        structuredClone(this.teachers)
    );
    private searchSubject = new BehaviorSubject<string>('');
    private genderSubject = new BehaviorSubject<string>('');
    private roleSubject = new BehaviorSubject<string>('');

    teachers$ = this.teacherSubject.asObservable();
    filteredTeachers$ = combineLatest([
        this.teachers$,
        this.searchSubject,
        this.genderSubject,
        this.roleSubject
    ]).pipe(
        map(([teachers, search, gender, role]) => {
            return teachers.filter(teacher => {
                const matchesSearch =
                    teacher.name.toLowerCase().includes(search.toLowerCase());

                const matchesGender =
                    !gender || teacher.gender === gender;

                const matchesRole =
                    !role || teacher.currentRole === role;

                return matchesSearch && matchesGender && matchesRole;
            });
        })
    );

    searchTeachers(value: string): void {
        this.searchSubject.next(value);
    }

    filterByGender(value: string): void {
        this.genderSubject.next(value);
    }

    filterByRole(value: string): void {
        this.roleSubject.next(value);
    }

    getFilteredTeachers(): Observable<Teacher[]> {
        return this.filteredTeachers$;
    }

    // ===========================================
    // CRUD METHODS
    // ===========================================
    getTeachers(): Observable<Teacher[]> {
        return this.teachers$;
    }

    getTeacherById(id: number): Teacher | undefined {
        const teacher = this.teachers.find(t => t.id === id);
        return teacher ? structuredClone(teacher) : undefined;
    }

    addTeacher(teacher: Teacher): void {
        this.teachers.push(teacher);
        this.teacherSubject.next(structuredClone(this.teachers));
    }

    updateTeacher(updatedTeacher: Teacher): void {
        const index = this.teachers.findIndex(
            t => t.id === updatedTeacher.id
        );

        if (index !== -1) {
            this.teachers[index] = updatedTeacher;
            this.teacherSubject.next(
                structuredClone(this.teachers)
            );
        }
    }

    deleteTeacher(id: number): void {
        this.teachers = this.teachers.filter(
            t => t.id !== id
        );
        this.teacherSubject.next(
            structuredClone(this.teachers)
        );
    }

    toggleVisibility(id: number): void {
        const index = this.teachers.findIndex(
            t => t.id === id
        );

        if (index !== -1) {
            this.teachers[index].visible =
                !this.teachers[index].visible;

            this.teacherSubject.next(
                structuredClone(this.teachers)
            );
        }
    }

    getNextTeacherId(): number {
        return Math.max(
            ...this.teachers.map(t => t.id),
            0
        ) + 1;
    }
}