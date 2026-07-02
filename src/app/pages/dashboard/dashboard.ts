import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  today: Date = new Date();

  dashboardStats = {
    institution: {
      totalEvents: 18,
      status: 'Active'
    },
    alumni: {
      male: 251,
      female: 231
    },
    students: {
      male: 134,
      female: 100
    }
  };

  get totalAlumni(): number {
    return (
      this.dashboardStats.alumni.male +
      this.dashboardStats.alumni.female
    );
  }

  get totalStudents(): number {
    return (
      this.dashboardStats.students.male +
      this.dashboardStats.students.female
    );
  }
}