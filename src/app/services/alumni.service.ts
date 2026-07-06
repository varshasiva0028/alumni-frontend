import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlumniModel, AlumniState } from '../models/alumni.model';

@Injectable({
    providedIn: 'root'
})
export class AlumniService {
    private readonly initialState: AlumniState = {
        alumniList: [
            {
                id: 1,
                name: 'Aruna',
                gender: 'female',
                batch: 2022,
                phone: '9876543210',
                classStudied: 'B.Tech - CSE',
                email: 'aruna@gmail.com',
                occupation: 'Software Engineer',
                address: 'Chennai',
                photo: 'https://i.pravatar.cc/250?img=11'
            },
            {
                id: 2,
                name: 'Vicky',
                gender: 'male',
                batch: 2021,
                phone: '9876543211',
                classStudied: 'B.Tech - IT',
                email: 'vignesh@gmail.com',
                occupation: 'Backend Developer',
                address: 'Coimbatore',
                photo: 'https://i.pravatar.cc/250?img=12'
            },
            {
                id: 3,
                name: 'Priya',
                gender: 'female',
                batch: 2020,
                phone: '9876543212',
                classStudied: 'B.E - ECE',
                email: 'priya@gmail.com',
                occupation: 'QA Engineer',
                address: 'Madurai',
                photo: 'https://i.pravatar.cc/250?img=13'
            },
            {
                id: 4,
                name: 'Rahul',
                gender: 'male',
                batch: 2023,
                phone: '9876543213',
                classStudied: 'B.Tech - AI & DS',
                email: 'rahul@gmail.com',
                occupation: 'Machine Learning Engineer',
                address: 'Salem',
                photo: 'https://i.pravatar.cc/250?img=14'
            },
            {
                id: 5,
                name: 'Meena',
                gender: 'female',
                batch: 2021,
                phone: '9876543214',
                classStudied: 'B.Sc - Computer Science',
                email: 'meena@gmail.com',
                occupation: 'Data Analyst',
                address: 'Trichy',
                photo: 'https://i.pravatar.cc/250?img=15'
            },
            {
                id: 6,
                name: 'Karthik',
                gender: 'male',
                batch: 2019,
                phone: '9876543215',
                classStudied: 'B.Tech - Mechanical',
                email: 'karthik@gmail.com',
                occupation: 'Project Engineer',
                address: 'Bangalore',
                photo: 'https://i.pravatar.cc/250?img=16'
            }
        ],
        searchText: '',
        viewType: 'grid',
        maleCount: 251,
        femaleCount: 231
    };

    private readonly state$ = new BehaviorSubject<AlumniState>(this.initialState);

    /**
     * Retrieves entire alumni collection as an Observable
     */
    getAlumniList(): Observable<AlumniModel[]> {
        return this.state$.pipe(map(state => state.alumniList));
    }

    /**
     * Retrieves search text query as an Observable
     */
    getSearchText(): Observable<string> {
        return this.state$.pipe(map(state => state.searchText));
    }

    /**
     * Retrieves active view type (grid | list) as an Observable
     */
    getViewType(): Observable<'grid' | 'list'> {
        return this.state$.pipe(map(state => state.viewType));
    }

    /**
     * Updates search text filter and emits changes
     */
    setSearchText(searchText: string): void {
        this.updateState({ searchText });
    }

    /**
     * Updates layout view type and emits changes
     */
    setViewType(viewType: 'grid' | 'list'): void {
        this.updateState({ viewType });
    }

    /**
     * Retrieves filtered alumni list matching search keywords
     */
    getFilteredAlumni(): Observable<AlumniModel[]> {
        return this.state$.pipe(
            map(state => {
                const search = state.searchText.trim().toLowerCase();
                if (!search) {
                    return state.alumniList;
                }
                return state.alumniList.filter(alumni =>
                    alumni.name.toLowerCase().includes(search) ||
                    alumni.phone.includes(search) ||
                    alumni.email.toLowerCase().includes(search) ||
                    alumni.classStudied.toLowerCase().includes(search) ||
                    alumni.occupation.toLowerCase().includes(search) ||
                    alumni.address.toLowerCase().includes(search) ||
                    alumni.batch.toString().includes(search)
                );
            })
        );
    }

    /**
     * Gender statistics Observables
     */
    getMaleCount(): Observable<number> {
        return this.state$.pipe(map(state => state.maleCount));
    }

    getFemaleCount(): Observable<number> {
        return this.state$.pipe(map(state => state.femaleCount));
    }

    getTotalAlumni(): Observable<number> {
        return this.state$.pipe(map(state => state.alumniList.length));
    }

    /**
     * Performs immutable state updates and notifies subscribers
     */
    private updateState(partialState: Partial<AlumniState>): void {
        const current = this.state$.value;
        this.state$.next({
            ...current,
            ...partialState
        });
    }

    /**
     * Simulates fetching latest alumni records. 
     * Prepares the architecture to replace with an HTTP REST call (Spring Boot) later.
     */
    refreshAlumni(): void {
        console.log('Alumni list refreshed from server.');
        this.state$.next({ ...this.state$.value });
    }
}