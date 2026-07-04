import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { HostListener } from '@angular/core';

interface GalleryEvent {
  id: number;
  title: string;
  quote: string;
  thumbnail: string;
  totalPhotos: number;
  chiefGuests: string[];
  images: string[];
}

interface GalleryItem {
  type: 'photo' | 'guest';
  image: string;
}

@Component({
  selector: 'app-gallery-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-details.html',
  styleUrl: './gallery-details.css'
})
export class GalleryDetails {

  zoomLevel = 1;

  minZoom = 1;

  maxZoom = 4;

  isLightboxOpen = false;

  activeImage = '';

  currentIndex = 0;

  selectedEvent!: GalleryEvent;

  galleryItems: GalleryItem[] = [];

  constructor(private location: Location) {

    const navigation = history.state;

    if (navigation.event) {

      this.selectedEvent = navigation.event;

      this.prepareGallery();

    }

  }
  zoomIn(): void {

    if (this.zoomLevel < this.maxZoom) {

      this.zoomLevel += 0.25;

    }

  }
  zoomOut(): void {

    if (this.zoomLevel > this.minZoom) {

      this.zoomLevel -= 0.25;

    }

  }
  resetZoom(): void {

    this.zoomLevel = 1;

  }
  downloadImage(): void {

    const link = document.createElement('a');

    link.href = this.activeImage;

    link.download = 'gallery-image.jpg';

    link.click();

  }

  @HostListener('document:keydown', ['$event'])

  handleKeyboard(event: KeyboardEvent) {

    if (!this.isLightboxOpen) return;

    switch (event.key) {

      case 'ArrowRight':
        this.nextImage();
        break;

      case 'ArrowLeft':
        this.previousImage();
        break;

      case 'Escape':
        this.closePreview();
        break;

      case '+':
        this.zoomIn();
        break;

      case '-':
        this.zoomOut();
        break;

    }

  }

  back(): void {

    this.location.back();

  }

  prepareGallery(): void {

    this.galleryItems = [];

    const total = this.selectedEvent.totalPhotos;

    let firstGuest = 12;
    let secondGuest = 24;

    if (total === 80) {

      firstGuest = 20;
      secondGuest = 60;

    }

    let guestIndex = 0;

    for (let i = 1; i <= total; i++) {

      if (i === firstGuest) {

        this.galleryItems.push({
          type: 'guest',
          image: this.selectedEvent.chiefGuests[guestIndex++]
        });

      }

      if (i === secondGuest) {

        this.galleryItems.push({
          type: 'guest',
          image: this.selectedEvent.chiefGuests[guestIndex++]
        });

      }

      this.galleryItems.push({
        type: 'photo',
        image: this.selectedEvent.images[i - 1]
      });

    }

  }
  openPreview(index: number): void {

    this.currentIndex = index;

    this.activeImage = this.galleryItems[index].image;

    this.isLightboxOpen = true;

  }

  closePreview(): void {

    this.isLightboxOpen = false;

  }

  nextImage(): void {

    if (this.currentIndex < this.galleryItems.length - 1) {

      this.currentIndex++;

    } else {

      this.currentIndex = 0;

    }

    this.activeImage = this.galleryItems[this.currentIndex].image;

  }

  previousImage(): void {

    if (this.currentIndex > 0) {

      this.currentIndex--;

    } else {

      this.currentIndex = this.galleryItems.length - 1;

    }

    this.activeImage = this.galleryItems[this.currentIndex].image;

  }

}