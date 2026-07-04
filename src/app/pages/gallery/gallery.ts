import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface GalleryEvent {
  id: number;
  title: string;
  quote: string;
  thumbnail: string;
  totalPhotos: number;
  chiefGuests: string[];
  images: string[];
}
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css']
})
export class GalleryComponent {
  constructor(private router: Router) { }

  // ============================
  // DUMMY EVENTS
  // ============================

 galleryEvents: GalleryEvent[] = [

  {
    id: 1,
    title: 'Annual Day',
    quote: 'Crossing 36th Educational Excellency',
    thumbnail: 'https://picsum.photos/800/500?1',
    totalPhotos: 80,
    chiefGuests: [
      'https://i.pravatar.cc/600?img=11',
      'https://i.pravatar.cc/600?img=12'
    ],
    images: Array.from({ length: 80 }, (_, i) =>
      `https://picsum.photos/600/400?random=${i + 1}`)
  },

  {
    id: 2,
    title: 'Republic Day',
    quote: 'Celebrated 77th Republic Day',
    thumbnail: 'https://picsum.photos/800/500?2',
    totalPhotos: 40,
    chiefGuests: [
      'https://i.pravatar.cc/600?img=13',
      'https://i.pravatar.cc/600?img=14'
    ],
    images: Array.from({ length: 40 }, (_, i) =>
      `https://picsum.photos/600/400?random=${i + 100}`)
  },

  {
    id: 3,
    title: 'Independence Day',
    quote: 'Celebrated 79th Independence Day',
    thumbnail: 'https://picsum.photos/800/500?3',
    totalPhotos: 40,
    chiefGuests: [
      'https://i.pravatar.cc/600?img=15',
      'https://i.pravatar.cc/600?img=16'
    ],
    images: Array.from({ length: 40 }, (_, i) =>
      `https://picsum.photos/600/400?random=${i + 200}`)
  },

  {
    id: 4,
    title: "Founder's Day",
    quote: "Our Founder's 100th Birthday",
    thumbnail: 'https://picsum.photos/800/500?4',
    totalPhotos: 40,
    chiefGuests: [
      'https://i.pravatar.cc/600?img=17',
      'https://i.pravatar.cc/600?img=18'
    ],
    images: Array.from({ length: 40 }, (_, i) =>
      `https://picsum.photos/600/400?random=${i + 300}`)
  },

  {
    id: 5,
    title: 'Sports Day',
    quote: 'Celebrated 36th Sports Day',
    thumbnail: 'https://picsum.photos/800/500?5',
    totalPhotos: 40,
    chiefGuests: [
      'https://i.pravatar.cc/600?img=19',
      'https://i.pravatar.cc/600?img=20'
    ],
    images: Array.from({ length: 40 }, (_, i) =>
      `https://picsum.photos/600/400?random=${i + 400}`)
  },

  {
    id: 6,
    title: 'Science Exhibition',
    quote: 'Showcasing Innovation and Creativity',
    thumbnail: 'https://picsum.photos/800/500?6',
    totalPhotos: 40,
    chiefGuests: [
      'https://i.pravatar.cc/600?img=21',
      'https://i.pravatar.cc/600?img=22'
    ],
    images: Array.from({ length: 40 }, (_, i) =>
      `https://picsum.photos/600/400?random=${i + 500}`)
  },

  {
    id: 7,
    title: 'Deepavali',
    quote: 'Celebrating the Festival of Lights Together',
    thumbnail: 'https://picsum.photos/800/500?7',
    totalPhotos: 40,
    chiefGuests: [
      'https://i.pravatar.cc/600?img=23',
      'https://i.pravatar.cc/600?img=24'
    ],
    images: Array.from({ length: 40 }, (_, i) =>
      `https://picsum.photos/600/400?random=${i + 600}`)
  },

  {
    id: 8,
    title: 'Graduation Day',
    quote: 'Honouring Our Young Graduates',
    thumbnail: 'https://picsum.photos/800/500?8',
    totalPhotos: 40,
    chiefGuests: [
      'https://i.pravatar.cc/600?img=25',
      'https://i.pravatar.cc/600?img=26'
    ],
    images: Array.from({ length: 40 }, (_, i) =>
      `https://picsum.photos/600/400?random=${i + 700}`)
  },

  {
    id: 9,
    title: 'Special Events',
    quote: 'Creating Memorable Moments Together',
    thumbnail: 'https://picsum.photos/800/500?9',
    totalPhotos: 40,
    chiefGuests: [
      'https://i.pravatar.cc/600?img=27',
      'https://i.pravatar.cc/600?img=28'
    ],
    images: Array.from({ length: 40 }, (_, i) =>
      `https://picsum.photos/600/400?random=${i + 800}`)
  },

  {
    id: 10,
    title: 'Special Occasion',
    quote: 'Celebrating Every Special Milestone',
    thumbnail: 'https://picsum.photos/800/500?10',
    totalPhotos: 40,
    chiefGuests: [
      'https://i.pravatar.cc/600?img=29',
      'https://i.pravatar.cc/600?img=30'
    ],
    images: Array.from({ length: 40 }, (_, i) =>
      `https://picsum.photos/600/400?random=${i + 900}`)
  },

  {
    id: 11,
    title: 'Smart Class Room',
    quote: 'Empowering Learning Through Technology',
    thumbnail: 'https://picsum.photos/800/500?11',
    totalPhotos: 40,
    chiefGuests: [
      'https://i.pravatar.cc/600?img=31',
      'https://i.pravatar.cc/600?img=32'
    ],
    images: Array.from({ length: 40 }, (_, i) =>
      `https://picsum.photos/600/400?random=${i + 1000}`)
  }

];

  // ============================
  // OPEN EVENT
  // ============================

  openGallery(event: GalleryEvent): void {

    this.router.navigate(
      ['/gallery', event.id],
      {
        state: {
          event: event
        }
      }
    );

  }
  addNewEvent(): void {
    this.router.navigate(['/events']);
  }
}