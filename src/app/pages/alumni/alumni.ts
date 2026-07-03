import { Component, HostListener, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AlumniModel {
  id: number;
  name: string;
  gender: 'male' | 'female';
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
      name: 'Vignesh',
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
  ];

  // Image Lightbox States
  isLightboxOpen = false;
  activeImgIndex = 0;
  isImageLoading = true;

  // Zoom & Pan System
  zoomScale = 1;
  panX = 0;
  panY = 0;
  isPanning = false;
  startX = 0;
  startY = 0;

  // Touch Gesture Swipes
  touchStartX = 0;
  touchEndX = 0;

  constructor(@Inject(DOCUMENT) private document: Document) {}

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
  

  // Open Lightbox
  openLightbox(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.activeImgIndex = index;
    this.isLightboxOpen = true;
    this.isImageLoading = true;
    this.resetZoom();
    this.document.body.style.overflow = 'hidden';
  }

  // Close Lightbox
  closeLightbox(): void {
    this.isLightboxOpen = false;
    this.resetZoom();
    this.document.body.style.overflow = '';
  }

  onImageLoaded(): void {
    this.isImageLoading = false;
  }

  get currentLightboxAlumni(): AlumniModel {
    return this.filteredAlumni[this.activeImgIndex];
  }

  // Navigation Options
  navigateLightbox(direction: number, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const total = this.filteredAlumni.length;
    if (total === 0) return;
    this.activeImgIndex = (this.activeImgIndex + direction + total) % total;
    this.isImageLoading = true;
    this.resetZoom();
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent): void {
    if (!this.isLightboxOpen) return;
    if (event.key === 'Escape') this.closeLightbox();
    else if (event.key === 'ArrowRight') this.navigateLightbox(1);
    else if (event.key === 'ArrowLeft') this.navigateLightbox(-1);
  }

  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.1 : -0.1;
    this.zoomScale = Math.min(Math.max(1, this.zoomScale + delta), 4);
    if (this.zoomScale === 1) this.resetZoom();
  }

  toggleDoubleClickZoom(event: MouseEvent): void {
    event.stopPropagation();
    this.zoomScale = this.zoomScale > 1 ? 1 : 2.5;
    if (this.zoomScale === 1) this.resetZoom();
  }

  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('.btn-dark-glass') || target.closest('.lightbox-main-img')) {
      return;
    }
    this.closeLightbox();
  }

  // Pan functionality
  startPan(event: MouseEvent): void {
    if (this.zoomScale <= 1) return;
    event.preventDefault();
    this.isPanning = true;
    this.startX = event.clientX - this.panX;
    this.startY = event.clientY - this.panY;
  }

  pan(event: MouseEvent): void {
    if (!this.isPanning || this.zoomScale <= 1) return;
    this.panX = event.clientX - this.startX;
    this.panY = event.clientY - this.startY;
  }

  endPan(): void {
    this.isPanning = false;
  }

  resetZoom(): void {
    this.zoomScale = 1;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
  }

  // Mobile Touch Swipes
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 50) {
      this.navigateLightbox(diff > 0 ? 1 : -1);
    }
  }
}