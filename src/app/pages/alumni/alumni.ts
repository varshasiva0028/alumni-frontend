import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AlumniModel {

  id: number;

  name: string;

  batch: number;

  phone: string;

  classStudied: string;

  email: string;

  occupation: string;

  address: string;

  photo: string;

}

@Component({
  selector: 'app-alumni',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './alumni.html',
  styleUrl: './alumni.css'
})
export class Alumni {

  searchText: string = '';

  alumniList: AlumniModel[] = [

    {
      id: 1,
      name: 'Aruna',
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
      name: 'Vignesh',
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
      batch: 2019,
      phone: '9876543215',
      classStudied: 'B.Tech - Mechanical',
      email: 'karthik@gmail.com',
      occupation: 'Project Engineer',
      address: 'Bangalore',
      photo: 'https://i.pravatar.cc/250?img=16'
    }

  ];

  get totalAlumni(): number {

    return this.alumniList.length;

  }

  get maleCount(): number {

    return 251;

  }

  get femaleCount(): number {

    return 231;

  }

  get filteredAlumni(): AlumniModel[] {

    if (!this.searchText.trim()) {

      return this.alumniList;

    }

    const search = this.searchText.toLowerCase();

    return this.alumniList.filter(alumni =>

      alumni.name.toLowerCase().includes(search) ||

      alumni.phone.includes(search) ||

      alumni.email.toLowerCase().includes(search) ||

      alumni.classStudied.toLowerCase().includes(search) ||

      alumni.occupation.toLowerCase().includes(search) ||

      alumni.address.toLowerCase().includes(search) ||

      alumni.batch.toString().includes(search)

    );

  }

}