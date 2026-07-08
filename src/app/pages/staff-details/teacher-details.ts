import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Teacher } from '../../models/teacher.model';
import { TeacherService } from '../../services/teacher.service';

@Component({
  selector: 'app-teacher-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-details.html',
  styleUrl: './teacher-details.css'
})
export class TeacherDetails implements OnInit {

  teacher: Teacher | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.back();
      return;
    }

    const staff = this.teacherService.getTeacherById(id);

    if (staff) {
      this.teacher = JSON.parse(JSON.stringify(staff));
    } else {
      alert('Staff member not found.');
      this.back();
    }
  }

  editStaff(): void {
    if (!this.teacher) return;
    this.router.navigate(['/update-staff', this.teacher.id]);
  }

  back(): void {
    this.location.back();
  }
}