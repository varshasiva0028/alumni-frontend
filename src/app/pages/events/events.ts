import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, Validators } from '@angular/forms';
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
export class EventsComponent implements OnInit {
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

  // Required Event Thumbnail field (prefilled with transparent 1x1 base64 png placeholder)
  thumbnailUrl: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  // Simulated upload progress state
  uploadProgress: number = 0;
  isUploading: boolean = false;

  // Drag and Drop Sorting State
  draggedIndex: number | null = null;

  // Programmatic FormControls utilizing Angular Validators
  titleControl = new FormControl('', [
    Validators.required,
  ]);

  quoteControl = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(250)
  ]);

  guestNameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(60),
    Validators.pattern(/^[A-Za-z\s.]+$/)
  ]);

  detail1Control = new FormControl('', [
    Validators.maxLength(80)
  ]);

  detail2Control = new FormControl('', [
    Validators.maxLength(120)
  ]);

  thumbnailControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {}

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

    if (!this.validateImage(file)) {
      this.errorMessage = `Guest photo file "${file.name}" is invalid or exceeds 5 MB. Allowed formats: JPG, JPEG, PNG, WEBP.`;
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
      if (!this.validateImage(file)) {
        this.errorMessage = `Guest photo "${file.name}" is invalid or exceeds 5 MB. Allowed formats: JPG, JPEG, PNG, WEBP.`;
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
      if (!this.validateImage(file)) {
        this.errorMessage = `Some files were skipped as they exceeded the 5 MB limit or had invalid formats.`;
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      element.value = '';
      return;
    }

    // Start upload progress
    this.isUploading = true;
    this.uploadProgress = 0;
    this.cdr.detectChanges();

    let loadedCount = 0;
    const totalFiles = validFiles.length;

    for (const file of validFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.zone.run(() => {
          this.otherPhotos.push(e.target.result);
          this.otherPhotos = [...this.otherPhotos];
          
          loadedCount++;
          this.uploadProgress = Math.round((loadedCount / totalFiles) * 100);
          this.cdr.detectChanges();

          if (loadedCount === totalFiles) {
            setTimeout(() => {
              this.zone.run(() => {
                this.isUploading = false;
                this.uploadProgress = 0;
                this.cdr.detectChanges();
              });
            }, 300);
          }
        });
      };
      reader.readAsDataURL(file);
    }

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

  // --- Programmatic Validators implementation using Angular Validators ---

  validateTitle(): boolean {
    const finalTitle = this.selectedEventTitle === 'Other Events' ? this.customEventTitle : this.selectedEventTitle;
    this.titleControl.setValue(finalTitle || '');

    if (this.titleControl.invalid) {
      if (this.titleControl.hasError('required')) {
        this.errorMessage = 'Event Title is required.';
      } else if (this.titleControl.hasError('minlength')) {
        this.errorMessage = 'Event Title must be at least 5 characters long.';
      } else if (this.titleControl.hasError('maxlength')) {
        this.errorMessage = 'Event Title cannot exceed 100 characters.';
      } else if (this.titleControl.hasError('pattern')) {
        this.errorMessage = 'Event Title can only contain letters, numbers, spaces, apostrophe, hyphen, and dot. Leading/trailing spaces are not allowed.';
      }
      this.cdr.detectChanges();
      return false;
    }

    if (finalTitle && finalTitle.trim().length === 0) {
      this.errorMessage = 'Event Title cannot contain only spaces.';
      this.cdr.detectChanges();
      return false;
    }

    return true;
  }

  validateQuote(): boolean {
    const quote = this.currentEventQuote;
    this.quoteControl.setValue(quote || '');

    if (this.quoteControl.invalid) {
      if (this.quoteControl.hasError('required')) {
        this.errorMessage = 'Event Quote is required.';
      } else if (this.quoteControl.hasError('minlength')) {
        this.errorMessage = 'Event Quote must be at least 10 characters long.';
      } else if (this.quoteControl.hasError('maxlength')) {
        this.errorMessage = 'Event Quote cannot exceed 250 characters.';
      }
      this.cdr.detectChanges();
      return false;
    }
    return true;
  }

  validateChiefGuests(): boolean {
    for (let i = 0; i < this.chiefGuests.length; i++) {
      const guest = this.chiefGuests[i];

      // Name Validation
      this.guestNameControl.setValue(guest.name || '');
      if (this.guestNameControl.invalid) {
        if (this.guestNameControl.hasError('required')) {
          this.errorMessage = `Chief Guest #${i + 1} Name is required.`;
        } else if (this.guestNameControl.hasError('minlength')) {
          this.errorMessage = `Chief Guest #${i + 1} Name must be at least 3 characters long.`;
        } else if (this.guestNameControl.hasError('maxlength')) {
          this.errorMessage = `Chief Guest #${i + 1} Name cannot exceed 60 characters.`;
        } else if (this.guestNameControl.hasError('pattern')) {
          this.errorMessage = `Chief Guest #${i + 1} Name can only contain alphabets, spaces, and dots.`;
        }
        this.cdr.detectChanges();
        return false;
      }

      // Guest Photo validation (Only validated if photo is uploaded)
      if (guest.photoUrl && !this.validateImage(guest.photoUrl)) {
        this.errorMessage = `Chief Guest #${i + 1} Photo format is invalid or exceeds 5 MB limit.`;
        this.cdr.detectChanges();
        return false;
      }

      // validation (detail1)
      this.detail1Control.setValue(guest.detail1 || '');
      if (this.detail1Control.invalid) {
        if (this.detail1Control.hasError('maxlength')) {
          this.errorMessage = `Chief Guest #${i + 1} Designation cannot exceed 80 characters.`;
        }
        this.cdr.detectChanges();
        return false;
      }

      // validation (detail2)
      this.detail2Control.setValue(guest.detail2 || '');
      if (this.detail2Control.invalid) {
        if (this.detail2Control.hasError('maxlength')) {
          this.errorMessage = `Chief Guest #${i + 1} Organization cannot exceed 120 characters.`;
        }
        this.cdr.detectChanges();
        return false;
      }
    }
    return true;
  }

  validateGallery(): boolean {
    if (this.otherPhotos.length === 0) {
      this.errorMessage = 'At least one gallery image is required before saving.';
      this.cdr.detectChanges();
      return false;
    }

    for (let i = 0; i < this.otherPhotos.length; i++) {
      if (!this.validateImage(this.otherPhotos[i])) {
        this.errorMessage = `Gallery image #${i + 1} is invalid or exceeds 5 MB.`;
        this.cdr.detectChanges();
        return false;
      }
    }
    return true;
  }

  validateThumbnail(): boolean {
    this.thumbnailControl.setValue(this.thumbnailUrl || '');
    if (this.thumbnailControl.invalid) {
      this.errorMessage = 'Thumbnail is required.';
      this.cdr.detectChanges();
      return false;
    }

    if (!this.validateImage(this.thumbnailUrl)) {
      this.errorMessage = 'Thumbnail image has invalid format or exceeds 5 MB limit.';
      this.cdr.detectChanges();
      return false;
    }
    return true;
  }

  validateImage(base64OrFile: any): boolean {
    if (!base64OrFile) return false;

    // Check if it is a File object (from input change selection)
    if (base64OrFile instanceof File) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(base64OrFile.type)) return false;
      if (base64OrFile.size > 5 * 1024 * 1024) return false;
      return true;
    }

    // Check if it is a Base64 string
    if (typeof base64OrFile === 'string' && base64OrFile.startsWith('data:')) {
      const parts = base64OrFile.split(',');
      if (parts.length < 2) return false;

      const mimeMatch = base64OrFile.match(/data:([^;]+);/);
      const mimeType = mimeMatch ? mimeMatch[1] : '';
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(mimeType)) return false;

      const base64Content = parts[1];
      const approxSizeBytes = Math.round((base64Content.length * 3) / 4);
      if (approxSizeBytes > 5 * 1024 * 1024) return false;

      return true;
    }

    return false;
  }

  canSubmit(): boolean {
    return (
      this.validateTitle() &&
      this.validateQuote() &&
      this.validateThumbnail() &&
      this.validateChiefGuests() &&
      this.validateGallery()
    );
  }

  async submitEvent(): Promise<void> {
    this.errorMessage = '';

    // Validate all controls via canSubmit before saving
    if (!this.canSubmit()) {
      this.cdr.detectChanges();
      return;
    }

    const finalTitle = this.selectedEventTitle === 'Other Events' ? this.customEventTitle.trim() : this.selectedEventTitle;

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
        resolve(resizedDataUrl);
      };

      img.onerror = (err) => {
        reject(err);
      };

      img.src = base64Str;
    });
  }
}