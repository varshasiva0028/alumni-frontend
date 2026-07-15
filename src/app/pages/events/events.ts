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
  chiefGuestFiles: { [index: number]: File } = {};
  otherPhotoFiles: File[] = [];

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
  ) { }

  ngOnInit(): void { }

  // Compute other photos limit dynamically
  get isAnnualDay(): boolean {
    const title = this.selectedEventTitle === 'Other Events' ? this.customEventTitle : this.selectedEventTitle;
    return title.toLowerCase().includes('annual day');
  }

  get maxGuests(): number {
    return this.isAnnualDay ? 5 : 3;
  }

  // Event gallery image limit is now set to 10 photos maximum
  get maxOtherPhotos(): number {
    return 10;
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
    // Step: File selection
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
    this.chiefGuestFiles[index] = file;
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
    // Step: File selection
    this.errorMessage = '';
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (!files) return;

    const remainingSlots = this.maxGuests - this.chiefGuests.length;
    if (files.length > remainingSlots) {
      this.errorMessage = `Only the first ${remainingSlots} images were uploaded to fit the maximum limit of ${this.maxGuests} guests.`;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    let nextIndex = this.chiefGuests.length;
    for (const file of filesToUpload) {
      if (!this.validateImage(file)) {
        this.errorMessage = `Guest photo "${file.name}" is invalid or exceeds 5 MB. Allowed formats: JPG, JPEG, PNG, WEBP.`;
        continue;
      }

      this.chiefGuestFiles[nextIndex] = file;
      nextIndex++;

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
    delete this.chiefGuestFiles[index];
    const newChiefGuestFiles: { [key: number]: File } = {};
    Object.keys(this.chiefGuestFiles).forEach((keyStr) => {
      const key = Number(keyStr);
      if (key > index) {
        newChiefGuestFiles[key - 1] = this.chiefGuestFiles[key];
      } else if (key < index) {
        newChiefGuestFiles[key] = this.chiefGuestFiles[key];
      }
    });
    this.chiefGuestFiles = newChiefGuestFiles;
    this.cdr.detectChanges();
    this.errorMessage = '';
  }

  // Gallery Photos Multi-Uploader with limit validation & progress simulation
  onOtherPhotosFileChange(event: Event): void {
    // Step: File selection
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
      this.otherPhotoFiles.push(file);
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
    this.otherPhotoFiles.splice(index, 1);
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

        const fileItem = this.otherPhotoFiles[this.draggedIndex!];
        this.otherPhotoFiles.splice(this.draggedIndex!, 1);
        this.otherPhotoFiles.splice(targetIndex, 0, fileItem);

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
    this.chiefGuestFiles = {};
    this.otherPhotoFiles = [];
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

    if (this.chiefGuests.length === 0) {
      this.errorMessage = 'Please add at least one Chief Guest.';
      return false;
    }

    for (let i = 0; i < this.chiefGuests.length; i++) {

      const guest = this.chiefGuests[i];

      if (!guest.photoUrl) {
        this.errorMessage = `Please upload photo for Chief Guest #${i + 1}.`;
        return false;
      }

      if (!guest.name.trim()) {
        this.errorMessage = `Please enter name for Chief Guest #${i + 1}.`;
        return false;
      }

      if (!guest.detail1.trim()) {
        this.errorMessage = `Please enter detail 1 for Chief Guest ${i + 1}.`;
        return false;
      }

      if (!guest.detail2.trim()) {
        this.errorMessage = `Please enter detail 2 for Chief Guest ${i + 1}.`;
        return false;
      }
    }

    return true;
  }

  validateGallery(): boolean {

    if (this.otherPhotos.length < 10) {
      this.errorMessage =
        `Please upload at least 10 gallery images. Currently uploaded: ${this.otherPhotos.length}.`;
      this.cdr.detectChanges();
      return false;
    }

    // Optional: Prevent more than 10 images
    if (this.otherPhotos.length > 10) {
      this.errorMessage =
        'You can upload a maximum of 10 gallery images.';
      this.cdr.detectChanges();
      return false;
    }
    // Validate each image
    for (let i = 0; i < this.otherPhotos.length; i++) {
      if (this.otherPhotos.length !== 10) {
        this.errorMessage =
          `Exactly 10 gallery images are required. Uploaded: ${this.otherPhotos.length}.`;
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
      console.log('--- START RESIZING EVENT IMAGES BEFORE UPLOAD ---');
      // Step: FormData creation
      const formData = new FormData();

      // Resize Chief Guest files
      for (const indexStr of Object.keys(this.chiefGuestFiles)) {
        const index = Number(indexStr);
        const file = this.chiefGuestFiles[index];
        if (file) {
          // Step: Upload preparation
          const blob = await this.resizeImage(file);
          formData.append('chiefGuests[]', blob, file.name);
        }
      }

      // Resize Gallery files
      for (let i = 0; i < this.otherPhotoFiles.length; i++) {
        const file = this.otherPhotoFiles[i];
        if (file) {
          // Step: Upload preparation
          const blob = await this.resizeImage(file);
          formData.append('gallery[]', blob, file.name);
        }
      }
      console.log('--- END RESIZING EVENT IMAGES BEFORE UPLOAD ---');

      // The previews in browser ('this.chiefGuests' and 'this.otherPhotos') use the original image Base64 to preserve preview functionality.
      // We removed the duplicate Base64 resizing call here to ensure images are only resized once.
      const payload = {
        title: finalTitle,
        quote: this.currentEventQuote,
        chiefGuests: this.chiefGuests,
        gallery: this.otherPhotos
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

  resizeImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        img.onload = () => {
          // Step: Canvas resize
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Could not get 2D context'));
          }

          const originalWidth = img.width;
          const originalHeight = img.height;

          // Determine orientation and target dimensions
          let targetWidth = 0;
          let targetHeight = 0;
          let orientation = '';

          if (originalWidth === originalHeight) {
            targetWidth = 798;
            targetHeight = 798;
            orientation = 'Square';
          } else if (originalWidth > originalHeight) {
            targetWidth = 798;
            targetHeight = 532;
            orientation = 'Landscape';
          } else {
            targetWidth = 532;
            targetHeight = 798;
            orientation = 'Portrait';
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Get image type/format to preserve original image format where possible
          const type = file.type || 'image/jpeg';
          const quality = type === 'image/jpeg' || type === 'image/jpg' ? 0.85 : undefined;

          // Step: Blob conversion
          canvas.toBlob((blob) => {
            if (blob) {
              // Log to console exactly as requested
              console.log('----------------------------------------');
              console.log('Original Image');
              console.log('----------------------------------------');
              console.log('File Name:', file.name);
              console.log('Dimensions:', `${originalWidth} × ${originalHeight}`);
              console.log('Original Size:', file.size, 'bytes');
              console.log('----------------------------------------');
              console.log('Resize Result');
              console.log('----------------------------------------');
              console.log('Orientation:', orientation);
              console.log('Resized Dimensions:', `${targetWidth} × ${targetHeight}`);
              console.log('Blob Size:', blob.size, 'bytes');
              console.log('----------------------------------------');
              console.log('Upload');
              console.log('----------------------------------------');
              console.log('Uploading resized Blob...');
              console.log('File Name:', file.name);
              console.log('Blob Size:', blob.size, 'bytes');

              // Display the temporary alert exactly as requested
              alert(
                `Original:\n${originalWidth} × ${originalHeight}\nFile Size: ${(file.size / 1024).toFixed(2)} KB\n\n` +
                `Resized:\n${targetWidth} × ${targetHeight}\nBlob Size: ${(blob.size / 1024).toFixed(2)} KB`
              );

              resolve(blob);
            } else {
              reject(new Error('Canvas toBlob conversion failed'));
            }
          }, type, quality);
        };

        img.onerror = (err) => reject(err);
        img.src = e.target.result;
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
}