import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    "Founder's Day",
    "Annual Day",
    "Republic Day",
    "Sports Day",
    "Science Exhibition",
    "Deepavali",
    "Independence Day",
    "Graduation Day",
    "Special Events",
    "Special Occasion",
    "Smart Class Room",
    "Other Events"
  ];

  eventQuotes: any = {
    "Founder's Day": { hasDynamicCount: false, prefix: "Our Founder's 100th Birthday" },
    "Founders Day": { hasDynamicCount: false, prefix: "Our Founder's 100th Birthday" },
    "Annual Day": { hasDynamicCount: true, startYear: 1990, prefix: "Crossing ", suffix: "th Educational Excellency" },
    "Deepavali": { hasDynamicCount: false, prefix: "Celebrated Deepavali with Souco Group" },
    "Republic Day": { hasDynamicCount: true, startYear: 1950, prefix: "Celebrated ", suffix: "th Republic Day" },
    "Independence Day": { hasDynamicCount: true, startYear: 1947, prefix: "Celebrated ", suffix: "th Independence Day" },
    "Special Events": { hasDynamicCount: false, prefix: "Adding 5 more Classes with the help of our Contributors" },
    "Special Event": { hasDynamicCount: false, prefix: "Adding 5 more Classes with the help of our Contributors" },
    "Graduation Day": { hasDynamicCount: false, prefix: "Our Little Graduates" },
    "Smart Class Room": { hasDynamicCount: false, prefix: "We added New Smart Class Room" },
    "Smart Classroom": { hasDynamicCount: false, prefix: "We added New Smart Class Room" },
    "Special Occasion": { hasDynamicCount: false, prefix: "Celebrating Moments, Creating Memories" },
    "Sports Day": { hasDynamicCount: true, startYear: 1990, prefix: "Celebrated ", suffix: "th Sports Day" },
    "Science Exhibition": { hasDynamicCount: false, prefix: "Showcasing Innovation and Creativity" }
  };

  customEventQuote: string = '';
  selectedEventTitle: string = '';
  customEventTitle: string = '';
  errorMessage: string = '';

  chiefGuests: ChiefGuest[] = [];
  otherPhotos: string[] = [];

  // Simulated upload progress state
  uploadProgress: number = 0;
  isUploading: boolean = false;

  // Drag and Drop Sorting State
  draggedIndex: number | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router
  ) { }
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

  get currentYear(): number {
    return new Date().getFullYear();
  }

  get currentEventQuote(): string {
    if (this.selectedEventTitle === 'Other Events') {
      return this.customEventQuote || '';
    }
    const config = this.eventQuotes[this.selectedEventTitle];
    if (!config) return '';
    if (config.hasDynamicCount) {
      const count = this.currentYear - config.startYear;
      return `${config.prefix}${count}${config.suffix}`;
    }
    return config.prefix;
  }

  resetQuotes(): void {
    this.customEventQuote = '';
  }

  onEventTitleChange(): void {
    this.customEventTitle = '';
    this.customEventQuote = '';
    this.errorMessage = '';

    // Automatically truncate lists if switching to lower bounds
    if (this.chiefGuests.length > this.maxGuests) {
      this.chiefGuests = this.chiefGuests.slice(0, this.maxGuests);
    }

    if (this.otherPhotos.length > this.maxOtherPhotos) {
      this.otherPhotos = this.otherPhotos.slice(0, this.maxOtherPhotos);
    }
    this.cdr.detectChanges();
  }

  // Add empty guest profile card dynamically
  addChiefGuest(): void {
    if (this.chiefGuests.length >= this.maxGuests) {
      this.errorMessage = `You can only add up to ${this.maxGuests} guest profiles for this event type.`;
      this.cdr.detectChanges();
      return;
    }
    this.errorMessage = '';
    this.chiefGuests.push({
      photoUrl: '',
      name: '',
      detail1: '',
      detail2: '',
      detail3: '',
      roleType: 'Chief Guest'
    });
    this.chiefGuests = [...this.chiefGuests];
    this.cdr.detectChanges();
  }

  // Chief Guest Profile circular avatar photo upload trigger
  onGuestPhotoSelected(event: Event, index: number): void {
    this.errorMessage = '';
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = `Image exceeds the 5 MB size limit.`;
      element.value = '';
      this.cdr.detectChanges();
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.zone.run(() => {
        this.chiefGuests[index].photoUrl = e.target.result;
        this.chiefGuests = [...this.chiefGuests];
        this.cdr.detectChanges();
      });
    };
    reader.readAsDataURL(file);
    element.value = '';
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
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = `Image "${file.name}" exceeds the 5 MB limit.`;
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.zone.run(() => {
          this.chiefGuests.push({
            photoUrl: e.target.result,
            name: '',
            detail1: '',
            detail2: '',
            detail3: '',
            roleType: 'Chief Guest'
          });
          this.chiefGuests = [...this.chiefGuests];
          this.cdr.detectChanges();
        });
      };
      reader.readAsDataURL(file);
    }
    element.value = '';
  }

  removeChiefGuest(index: number): void {
    this.chiefGuests.splice(index, 1);
    this.chiefGuests = [...this.chiefGuests];
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();

    const interval = setInterval(() => {
      this.zone.run(() => {
        this.uploadProgress += 10;
        this.cdr.detectChanges();

        if (this.uploadProgress >= 100) {
          clearInterval(interval);
          this.isUploading = false;

          for (const file of validFiles) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.zone.run(() => {
                this.otherPhotos.push(e.target.result);
                this.otherPhotos = [...this.otherPhotos];
                this.cdr.detectChanges();
              });
            };
            reader.readAsDataURL(file);
          }
          this.cdr.detectChanges();
        }
      });
    }, 120);

    element.value = '';
  }

  removeOtherPhoto(index: number): void {
    this.otherPhotos.splice(index, 1);
    this.otherPhotos = [...this.otherPhotos];
    this.cdr.detectChanges();
  }

  // HTML5 Native Drag & Drop event bindings
  onDragStart(index: number): void {
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(targetIndex: number): void {
    if (this.draggedIndex !== null && this.draggedIndex !== targetIndex) {
      this.zone.run(() => {
        const item = this.otherPhotos[this.draggedIndex!];
        this.otherPhotos.splice(this.draggedIndex!, 1);
        this.otherPhotos.splice(targetIndex, 0, item);
        this.otherPhotos = [...this.otherPhotos];
        this.cdr.detectChanges();
      });
    }
    this.draggedIndex = null;
  }

  resetForm(): void {
    this.selectedEventTitle = '';
    this.customEventTitle = '';
    this.chiefGuests = [];
    this.otherPhotos = [];
    this.errorMessage = '';
    this.resetQuotes();
    this.cdr.detectChanges();
  }

  async submitEvent(): Promise<void> {
    this.errorMessage = '';
    const finalTitle = this.selectedEventTitle === 'Other Events' ? this.customEventTitle.trim() : this.selectedEventTitle;

    if (!finalTitle) {
      this.errorMessage = 'Please select or specify a category event title.';
      this.cdr.detectChanges();
      return;
    }

    try {
      // Resize Chief Guest photos asynchronously
      const resizedGuests = await Promise.all(
        this.chiefGuests.map(async (guest) => {
          let resizedPhoto = guest.photoUrl;
          if (guest.photoUrl) {
            resizedPhoto = await this.resizeImage(guest.photoUrl);
          }
          return {
            ...guest,
            photoUrl: resizedPhoto
          };
        })
      );

      // Resize Gallery photos asynchronously
      const resizedGallery = await Promise.all(
        this.otherPhotos.map(async (photo) => {
          return await this.resizeImage(photo);
        })
      );

      const payload = {
        title: finalTitle,
        quote: this.currentEventQuote,
        chiefGuests: resizedGuests,
        gallery: resizedGallery
      };

      console.log('Saved Event Details:', payload);

      alert('Event details saved successfully!');

      this.resetForm();

      this.router.navigate(['/gallery']);
    } catch (err) {
      console.error('Error processing images:', err);
      this.errorMessage = 'An error occurred while resizing event images.';
      this.cdr.detectChanges();
    }
  }

  resizeImage(base64Str: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!base64Str || !base64Str.startsWith('data:')) {
        return resolve(base64Str);
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas 2D context'));
        }
        const w = img.width;
        const h = img.height;
        let targetWidth = 0;
        let targetHeight = 0;
        if (w >= h) {
          targetWidth = 798;
          targetHeight = 532;
        } else {
          targetWidth = 532;
          targetHeight = 798;
        }
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // Draw image stretched to output size
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        // Detect mimeType to preserve JPEG/PNG formats
        let mimeType = 'image/jpeg';
        const match = base64Str.match(/data:([^;]+);/);
        if (match && match[1]) {
          mimeType = match[1];
        }
        const resizedDataUrl = canvas.toDataURL(mimeType);

        // Testing only
        window.open(resizedDataUrl, '_blank');

        console.log(`Resized Image: ${canvas.width} x ${canvas.height}`);

        resolve(resizedDataUrl);
      };

      img.onerror = (err) => {
        reject(err);
      };

      img.src = base64Str;
    });

  }
}