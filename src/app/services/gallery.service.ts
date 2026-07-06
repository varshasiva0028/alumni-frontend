import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor() { }

  private galleryEvents: Event[] = [];

  // ============================
  // GET ALL EVENTS
  // ============================

  getEvents(): Event[] {

    return this.galleryEvents;

  }

}