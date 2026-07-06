import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../services/gallery.service';
import { Event } from '../../models/event.model';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css']
})
export class GalleryComponent {

  constructor(
    private router: Router,
    private galleryService: GalleryService
  ) { }
  ngOnInit(): void {

    this.galleryEvents$ = this.galleryService.getEvents();

  }
  // ============================
  // DUMMY EVENTS
  // ============================
  galleryEvents$!: Observable<Event[]>;  // ============================
  // OPEN GALLERY
  // ============================
  openGallery(event: Event): void {

    this.router.navigate(['/gallery', event.id]);

  }
  toggleVisibility(event: Event): void {

  const updatedEvent = {
    ...event,
    visible: !event.visible
  };

  this.galleryService.updateEvent(updatedEvent);

}

  // ============================
  // ADD NEW EVENT
  // ============================

  addNewEvent(): void {

    this.router.navigate(['/events']);

  }

  // ============================
  // EDIT EVENT
  // ============================

  editEvent(event: Event): void {

    this.router.navigate(['/update-event', event.id]);

  }

}