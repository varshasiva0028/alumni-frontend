import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  today: Date = new Date();

  // Observable states consumed by async pipe in HTML template
  stats$!: Observable<DashboardStats>;
  totalAlumni$!: Observable<number>;
  totalStudents$!: Observable<number>;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    // Single source of truth from service
    this.stats$ = this.dashboardService.getDashboardStats();

    // Derived stats using RxJS map operator
    this.totalAlumni$ = this.stats$.pipe(
      map(stats => stats.alumni.male + stats.alumni.female)
    );

    this.totalStudents$ = this.stats$.pipe(
      map(stats => stats.students.male + stats.students.female)
    );
  }

  // Delegate actions to the service keeping component lean
  incrementEvents(): void {
    this.dashboardService.incrementEvents();
  }

  incrementAlumni(gender: 'male' | 'female'): void {
    this.dashboardService.incrementAlumni(gender);
  }

  incrementStudents(gender: 'male' | 'female'): void {
    this.dashboardService.incrementStudents(gender);
  }

}