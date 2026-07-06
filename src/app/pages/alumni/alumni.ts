import { Component, HostListener, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AlumniModel } from '../../models/alumni.model';
import { AlumniService } from '../../services/alumni.service';

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
export class Alumni implements OnInit, OnDestroy {
  // Observables consumed via async pipe in HTML
  searchText$!: Observable<string>;
  viewType$!: Observable<'grid' | 'list'>;
  filteredAlumni$!: Observable<AlumniModel[]>;
  totalAlumni$!: Observable<number>;
  maleCount$!: Observable<number>;
  femaleCount$!: Observable<number>;

  // Subscription reference to sync filtered list for Lightbox navigation
  private filteredAlumniSub!: Subscription;
  currentFilteredAlumni: AlumniModel[] = [];

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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private alumniService: AlumniService
  ) {}

  ngOnInit(): void {
    // Bind Observables to service
    this.searchText$ = this.alumniService.getSearchText();
    this.viewType$ = this.alumniService.getViewType();
    this.filteredAlumni$ = this.alumniService.getFilteredAlumni();
    this.totalAlumni$ = this.alumniService.getTotalAlumni();
    this.maleCount$ = this.alumniService.getMaleCount();
    this.femaleCount$ = this.alumniService.getFemaleCount();

    // Cache current filtered list for synchronous index-based lightbox navigation
    this.filteredAlumniSub = this.filteredAlumni$.subscribe(list => {
      this.currentFilteredAlumni = list;
    });
  }

  ngOnDestroy(): void {
    if (this.filteredAlumniSub) {
      this.filteredAlumniSub.unsubscribe();
    }
  }

  // Update search query via service
  onSearchChange(text: string): void {
    this.alumniService.setSearchText(text);
  }

  // Update layout view via service
  onViewTypeChange(view: 'grid' | 'list'): void {
    this.alumniService.setViewType(view);
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
    return this.currentFilteredAlumni[this.activeImgIndex];
  }

  // Navigation Options
  navigateLightbox(direction: number, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const total = this.currentFilteredAlumni.length;
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