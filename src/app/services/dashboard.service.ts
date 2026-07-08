import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DashboardStats } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Initial dummy state matching original component stats
  private readonly initialStats: DashboardStats = {
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
    },

    teachingStaff: {
      male: 18,
      female: 22
    },

    nonTeachingStaff: {
      male: 9,
      female: 12
    }
  };

  // BehaviorSubject as the single source of truth for dashboard statistics
  private readonly stats$ = new BehaviorSubject<DashboardStats>(this.initialStats);

  incrementTeachingStaff(
    gender: 'male' | 'female'
  ): void {

    const current = this.stats$.value;

    this.updateDashboardStats({
      teachingStaff: {
        ...current.teachingStaff,
        [gender]: current.teachingStaff[gender] + 1
      }
    });

  }

  incrementNonTeachingStaff(
    gender: 'male' | 'female'
  ): void {

    const current = this.stats$.value;

    this.updateDashboardStats({
      nonTeachingStaff: {
        ...current.nonTeachingStaff,
        [gender]: current.nonTeachingStaff[gender] + 1
      }
    });

  }

  /**
   * Returns dashboard stats as an Observable for components to subscribe to
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.stats$.asObservable();
  }

  /**
   * Sets the entire dashboard stats state (full overwrite)
   * Designed to easily handle REST API load events
   */
  setDashboardStats(stats: DashboardStats): void {
    this.stats$.next({
      institution: { ...stats.institution },
      alumni: { ...stats.alumni },
      students: { ...stats.students },
      teachingStaff: { ...stats.teachingStaff },
      nonTeachingStaff: { ...stats.nonTeachingStaff }
    });
  }

  /**
   * Immutably updates partial stats within the state
   */
  updateDashboardStats(partialStats: Partial<DashboardStats>): void {
    const current = this.stats$.value;
    const updated = {
      ...current,
      ...partialStats
    };
    this.stats$.next(updated);
  }


  /**
   * Business Logic: Increments the total events count
   */
  incrementEvents(): void {
    const current = this.stats$.value;
    this.updateDashboardStats({
      institution: {
        ...current.institution,
        totalEvents: current.institution.totalEvents + 1
      }
    });
  }

  /**
   * Business Logic: Increments registered alumni count by gender
   */
  incrementAlumni(gender: 'male' | 'female'): void {
    const current = this.stats$.value;
    this.updateDashboardStats({
      alumni: {
        ...current.alumni,
        [gender]: current.alumni[gender] + 1
      }
    });
  }

  /**
   * Business Logic: Increments student enrollment count by gender
   */
  incrementStudents(gender: 'male' | 'female'): void {
    const current = this.stats$.value;
    this.updateDashboardStats({
      students: {
        ...current.students,
        [gender]: current.students[gender] + 1
      }
    });
  }
}