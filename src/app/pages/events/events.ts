import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChiefGuest {
  photoUrl: string;
  name: string;
  detail1: string;
  detail2: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class EventsComponent {
  predefinedTitles: string[] = [
    'Founders Day',
    'Annual Day',
    'Republic Day',
    'Sports Day',
    'Science Exhibition',
    'Deepavali',
    'Independence Day',
    'Graduation Day',
    'Special Event',
    'Special Occasion',
    'Smart Classroom',
    'Other Events'
  ];

  selectedEventTitle: string = '';
  customEventTitle: string = '';
  errorMessage: string = '';

  chiefGuests: ChiefGuest[] = [];
  otherPhotos: string[] = [];

  // Dynamic limits calculation
  get maxOtherPhotos(): number {
    return this.selectedEventTitle === 'Annual Day' ? 80 : 40;
  }

  onEventTitleChange(): void {
    this.customEventTitle = '';
    this.errorMessage = '';
    
    // Automatically truncate photos list if switching to an event category with lower limit bounds
    if (this.otherPhotos.length > this.maxOtherPhotos) {
      this.otherPhotos = this.otherPhotos.slice(0, this.maxOtherPhotos);
      this.errorMessage = `Event photos list was truncated to fit the limit of ${this.maxOtherPhotos} images for this category.`;
    }
  }

  // Chief Guests Photo Uploader Handler
  onChiefGuestFileChange(event: Event): void {
    this.errorMessage = '';
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (!files) return;

    const remainingSlots = 5 - this.chiefGuests.length;
    if (files.length > remainingSlots) {
      this.errorMessage = `You can only upload up to 5 Chief Guest images. There are only ${remainingSlots} slots remaining.`;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    for (const file of filesToUpload) {
      // Validate file size limit (5 MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = `Image "${file.name}" exceeds the 5 MB limit.`;
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.chiefGuests.push({
          photoUrl: e.target.result,
          name: '',
          detail1: '',
          detail2: ''
        });
      };
      reader.readAsDataURL(file);
    }
    element.value = ''; // Reset uploader input element
  }

  removeChiefGuest(index: number): void {
    this.chiefGuests.splice(index, 1);
  }

  // Gallery Photos Uploader Handler
  onOtherPhotosFileChange(event: Event): void {
    this.errorMessage = '';
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (!files) return;

    const limit = this.maxOtherPhotos;
    const remainingSlots = limit - this.otherPhotos.length;

    if (files.length > remainingSlots) {
      this.errorMessage = `You can only upload up to ${limit} event gallery photos. You have ${remainingSlots} slots remaining.`;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    for (const file of filesToUpload) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.otherPhotos.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    element.value = ''; // Reset uploader input element
  }

  removeOtherPhoto(index: number): void {
    this.otherPhotos.splice(index, 1);
  }

  resetForm(): void {
    this.selectedEventTitle = '';
    this.customEventTitle = '';
    this.chiefGuests = [];
    this.otherPhotos = [];
    this.errorMessage = '';
  }

  submitEvent(): void {
    this.errorMessage = '';
    const finalTitle = this.selectedEventTitle === 'Other Events' ? this.customEventTitle.trim() : this.selectedEventTitle;

    if (!finalTitle) {
      this.errorMessage = 'Please select or specify a category event title.';
      return;
    }

    const payload = {
      title: finalTitle,
      chiefGuests: this.chiefGuests,
      gallery: this.otherPhotos
    };

    console.log('Saved Event Details:', payload);
    alert('Event details saved successfully!');
    this.resetForm();
  }
}