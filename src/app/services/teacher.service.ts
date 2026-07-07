import { Injectable } from '@angular/core';
import { Teacher } from '../models/teacher.model';
import { combineLatest, map, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TeacherService {

    constructor() { }

    // ===========================================
    // DUMMY DATA
    // ===========================================
    private createTeacher(
        id: number,
        photo: number,
        name: string,
        dob: Date,
        gender: 'Male' | 'Female' | 'Other',
        phone: string,
        email: string,
        bloodGroup: string,
        address: string,
        aadhaar: string,
        qualification: string,
        role: string,
        salary: number,
        hasExperience: boolean,
        years: number,
        details: string,
        languages: string[]
    ): Teacher {

        return {
            id,
            photo: `https://i.pravatar.cc/400?img=${photo}`,
            name,
            dateOfBirth: dob,
            gender,
            phoneNumber: phone,
            email,
            bloodGroup,
            address,
            aadhaarNumber: aadhaar,
            qualification,
            currentRole: role,
            salary,
            hasExperience,
            experienceYears: years,
            experienceDetails: details,
            languagesKnown: languages,
            visible: true
        };

    }
    private teachers: Teacher[] = [

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
            'M.Ed',
            'Principal',
            85000,
            true,
            22,
            'Academic Administration',
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
            'M.Sc',
            'Mathematics Teacher',
            52000,
            true,
            12,
            'Higher Secondary Mathematics',
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
            'M.A',
            'English Teacher',
            48000,
            true,
            8,
            'Spoken English & Literature',
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
            'M.Sc',
            'Science Teacher',
            50000,
            true,
            10,
            'Physics & Chemistry',
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
            'B.Ed',
            'Primary Teacher',
            35000,
            true,
            5,
            'Primary Education',
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
            'MCA',
            'Computer Instructor',
            56000,
            true,
            11,
            'Programming & Computer Science',
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
            'M.P.Ed',
            'Physical Education Teacher',
            42000,
            true,
            7,
            'Sports & Physical Training',
            ['Tamil', 'English']
        ),

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
            'M.A Music',
            'Music Teacher',
            40000,
            true,
            15,
            'Carnatic Music',
            ['Tamil']
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
            'MFA',
            'Art Teacher',
            39000,
            true,
            6,
            'Drawing & Painting',
            ['Tamil', 'English']
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
            'M.Ed',
            'Vice Principal',
            70000,
            true,
            18,
            'School Administration',
            ['Tamil', 'English', 'Hindi']
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