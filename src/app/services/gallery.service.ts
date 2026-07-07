import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event, ChiefGuest, GalleryImage } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor() { }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private createChiefGuests(img1: number, img2: number): ChiefGuest[] {

    return [
      {
        name: 'Chief Guest 1',
        image: `https://i.pravatar.cc/600?img=${img1}`,
        visible: true,
       detail1: '',
        detail2: ''
      },
      {
        name: 'Chief Guest 2',
        image: `https://i.pravatar.cc/600?img=${img2}`,
        visible: true,
        detail1: '',
        detail2: ''
      }
    ];

  }

  private createGalleryImages(count: number, start: number): GalleryImage[] {

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      image: `https://picsum.photos/600/400?random=${start + i}`,
      visible: true
    }));

  }

  // =====================================================
  // EVENTS
  // =====================================================

  private galleryEvents: Event[] = [

    this.createEvent(
      1,
      'Annual Day',
      'Crossing 36th Educational Excellency',
      1,
      80,
      11,
      12,
      1
    ),

    this.createEvent(
      2,
      'Republic Day',
      'Celebrated 77th Republic Day',
      2,
      40,
      13,
      14,
      100
    ),

    this.createEvent(
      3,
      'Independence Day',
      'Celebrated 79th Independence Day',
      3,
      40,
      15,
      16,
      200
    ),

    this.createEvent(
      4,
      "Founder's Day",
      "Our Founder's 100th Birthday",
      4,
      40,
      17,
      18,
      300
    ),

    this.createEvent(
      5,
      'Sports Day',
      'Celebrated 36th Sports Day',
      5,
      40,
      19,
      20,
      400
    ),

    this.createEvent(
      6,
      'Science Exhibition',
      'Showcasing Innovation and Creativity',
      6,
      40,
      21,
      22,
      500
    ),

    this.createEvent(
      7,
      'Deepavali',
      'Celebrating the Festival of Lights Together',
      7,
      40,
      23,
      24,
      600
    ),

    this.createEvent(
      8,
      'Graduation Day',
      'Honouring Our Young Graduates',
      8,
      40,
      25,
      26,
      700
    ),

    this.createEvent(
      9,
      'Special Events',
      'Creating Memorable Moments Together',
      9,
      40,
      27,
      28,
      800
    ),

    this.createEvent(
      10,
      'Special Occasion',
      'Celebrating Every Special Milestone',
      10,
      40,
      29,
      30,
      900
    ),

    this.createEvent(
      11,
      'Smart Class Room',
      'Empowering Learning Through Technology',
      11,
      40,
      31,
      32,
      1000
    )

  ];
  private eventsSubject = new BehaviorSubject<Event[]>(
    structuredClone(this.galleryEvents)
  );

  events$ = this.eventsSubject.asObservable();

  // =====================================================
  // EVENT FACTORY
  // =====================================================

  private createEvent(
    id: number,
    title: string,
    quote: string,
    thumbnail: number,
    totalPhotos: number,
    guest1: number,
    guest2: number,
    galleryStart: number
  ): Event {

    return {

      id,

      title,

      quote,

      thumbnail: `https://picsum.photos/800/500?${thumbnail}`,

      visible: true,

      totalPhotos,

      chiefGuests: this.createChiefGuests(guest1, guest2),

      galleryImages: this.createGalleryImages(
        totalPhotos,
        galleryStart
      )

    };

  }

  // =====================================================
  // CRUD METHODS
  // =====================================================
  toggleEventVisibility(id: number): void {

    const index = this.galleryEvents.findIndex(e => e.id === id);

    if (index === -1) return;

    this.galleryEvents[index].visible = !this.galleryEvents[index].visible;

    this.eventsSubject.next(
      structuredClone(this.galleryEvents)
    );

  }
  getEvents(): Observable<Event[]> {

    return this.events$;

  }
  getEventById(id: number): Event | undefined {

    const event = this.galleryEvents.find(e => e.id === id);

    return event ? structuredClone(event) : undefined;

  }
  addEvent(event: Event): void {

    this.galleryEvents.push(event);

    this.eventsSubject.next(
      structuredClone(this.galleryEvents)
    );

  }

  updateEvent(updatedEvent: Event): void {

    const index = this.galleryEvents.findIndex(
      e => e.id === updatedEvent.id
    );

    if (index !== -1) {

      this.galleryEvents[index] = updatedEvent;

      this.eventsSubject.next(
        structuredClone(this.galleryEvents)
      );

    }

  }
  deleteEvent(id: number): void {

    this.galleryEvents =
      this.galleryEvents.filter(e => e.id !== id);

    this.eventsSubject.next(
      structuredClone(this.galleryEvents)
    );

  }
  getNextEventId(): number {

    return Math.max(
      ...this.galleryEvents.map(e => e.id),
      0
    ) + 1;

  }

}