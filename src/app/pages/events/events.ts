import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChiefGuest {
  photoUrl: string;
  name: string;
  detail1: string;
  detail2: string;
  detail3: string;
  roleType: 'Chief Guest' | 'Special Guest';
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

  // Simulated upload progress state
  uploadProgress: number = 0;
  isUploading: boolean = false;

  // Compute other photos limit dynamically
  get isAnnualDay(): boolean {
    const title = this.selectedEventTitle === 'Other Events' ? this.customEventTitle : this.selectedEventTitle;
    return title.toLowerCase().includes('annual day');
  }

  get maxGuests(): number {
    return this.isAnnualDay ? 5 : 3;
  }

  get maxOtherPhotos(): number {
    return this.isAnnualDay ? 80 : 40;
  }

  onEventTitleChange(): void {
    this.customEventTitle = '';
    this.errorMessage = '';
    
    // Automatically truncate lists if switching to lower bounds
    if (this.chiefGuests.length > this.maxGuests) {
      this.chiefGuests = this.chiefGuests.slice(0, this.maxGuests);
      this.errorMessage = `Chief Guest list was truncated to fit the limit of ${this.maxGuests} for this category.`;
    }

    if (this.otherPhotos.length > this.maxOtherPhotos) {
      this.otherPhotos = this.otherPhotos.slice(0, this.maxOtherPhotos);
      this.errorMessage = `Gallery photos list was truncated to fit the limit of ${this.maxOtherPhotos} for this category.`;
    }
  }

  // Chief Guests Uploader (Automatically generates cards on upload)
  onChiefGuestFileChange(event: Event): void {
    this.errorMessage = '';
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (!files) return;

    const remainingSlots = this.maxGuests - this.chiefGuests.length;
    if (files.length > remainingSlots) {
      this.errorMessage = `Only the first ${remainingSlots} images were uploaded to fit the maximum limit of ${this.maxGuests} guests.`;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    for (const file of filesToUpload) {
      // Validate file size limit (5 MB) and format
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
          detail2: '',
          detail3: '',
          roleType: 'Chief Guest'
        });
      };
      reader.readAsDataURL(file);
    }
    element.value = ''; 
  }

  removeChiefGuest(index: number): void {
    this.chiefGuests.splice(index, 1);
    this.errorMessage = '';
  }

  // Gallery Photos Multi-Uploader with limit validation & progress simulation
  onOtherPhotosFileChange(event: Event): void {
    this.errorMessage = '';
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (!files) return;

    const limit = this.maxOtherPhotos;
    const remainingSlots = limit - this.otherPhotos.length;

    if (files.length > remainingSlots) {
      this.errorMessage = `Limit exceeded. Only the first ${remainingSlots} images were accepted to fit the maximum limit of ${limit} photos.`;
    }

    const validFiles: File[] = [];
    for (const file of Array.from(files).slice(0, remainingSlots)) {
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = `Some files were skipped as they exceeded the 5 MB limit.`;
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      element.value = '';
      return;
    }

    // Progress bar simulation
    this.isUploading = true;
    this.uploadProgress = 0;
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        this.isUploading = false;
        
        for (const file of validFiles) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.otherPhotos.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
    }, 120);

    element.value = '';
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