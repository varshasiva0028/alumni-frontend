import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GalleryService } from '../../services/gallery.service';
import { Event } from '../../models/event.model';
import {
  DragDropModule,
  CdkDragDrop
} from '@angular/cdk/drag-drop';
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  HostListener
} from '@angular/core';

@Component({
  selector: 'app-update-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  templateUrl: './update-event.html',
  styleUrl: './update-event.css'
})
export class UpdateEventComponent implements OnInit {
  showAdvancedEditor = false;
  errorMessage = '';

  @ViewChild('thumbnailInput')
  thumbnailInput!: ElementRef<HTMLInputElement>;

  @ViewChild('guestInput')
  guestInput!: ElementRef<HTMLInputElement>;

  @ViewChild('galleryInput')
  galleryInput!: ElementRef<HTMLInputElement>;

  // ===========================================
  // EVENT
  // ===========================================
  event!: Event;
  selectedGuestIndex: number | null = null;
  selectedGalleryImageIndex: number | null = null;

  // Unsaved changes state tracking
  originalEventJson = '';

  // All events list for title duplicate checking
  eventsList: Event[] = [];

  // Reactive Form
  eventForm!: FormGroup;

  thumbnailFile: File | null = null;
  chiefGuestFiles: { [index: number]: File } = {};
  galleryFiles: { [index: number]: File } = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private galleryService: GalleryService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // Initialize empty form structure
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      quote: ['', Validators.required],
      thumbnail: ['', Validators.required],
      chiefGuests: this.fb.array([]),
      galleryImages: this.fb.array([])
    });

    // Load events list for title duplicate checking
    this.galleryService.getEvents().subscribe(events => {
      this.eventsList = events;
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    const event = this.galleryService.getEventById(id);
    if (event) {
      this.event = structuredClone(event);
      
      this.eventForm.patchValue({
        title: this.event.title,
        quote: this.event.quote,
        thumbnail: this.event.thumbnail
      });

      // Populate FormArray with chiefGuests mapping designation/organization to detail1/detail2
      const guestsArray = this.chiefGuestsArray;
      guestsArray.clear();
      (this.event.chiefGuests || []).forEach(guest => {
        guestsArray.push(this.fb.group({
          name: [guest.name, Validators.required],
          image: [guest.image, Validators.required],
          visible: [guest.visible ?? true],
          detail1: [guest.detail1, Validators.required],
          detail2: [guest.detail2, Validators.required]
        }));
      });

      // Populate FormArray with galleryImages
      const galleryArray = this.galleryImagesArray;
      galleryArray.clear();
      (this.event.galleryImages || []).forEach(img => {
        galleryArray.push(this.fb.group({
          id: [img.id],
          image: [img.image, Validators.required],
          visible: [img.visible ?? true]
        }));
      });

      this.originalEventJson = JSON.stringify(this.eventForm.value);
    }
  }

  // Getters for form array structures
  get chiefGuestsArray(): FormArray {
    return this.eventForm.get('chiefGuests') as FormArray;
  }

  get galleryImagesArray(): FormArray {
    return this.eventForm.get('galleryImages') as FormArray;
  }

  // Prevent accidental reload or navigation with unsaved edits
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.hasUnsavedChanges()) {
      $event.returnValue = true;
    }
  }

  hasUnsavedChanges(): boolean {
    return this.originalEventJson !== JSON.stringify(this.eventForm.value);
  }

  // ===========================================
  // BACK
  // ===========================================
  back(): void {
    if (this.hasUnsavedChanges()) {
      const confirmLeave = confirm('You have unsaved changes. Are you sure you want to discard them and go back?');
      if (!confirmLeave) return;
    }
    this.router.navigate(['/gallery']);
  }

  // ===========================================
  // ADVANCED EDITOR
  // ===========================================
  openAdvancedEditor(): void {
    this.showAdvancedEditor = true;
  }

  closeAdvancedEditor(): void {
    this.showAdvancedEditor = false;
  }

  // ===========================================
  // COUNTS
  // ===========================================
  getVisibleCount(): number {
    return this.galleryImagesArray.controls.filter(
      (control: any) => control.get('visible')?.value
    ).length;
  }

  getHiddenCount(): number {
    return this.galleryImagesArray.controls.filter(
      (control: any) => !control.get('visible')?.value
    ).length;
  }

  // ===========================================
  // THUMBNAIL
  // ===========================================
  changeThumbnail(): void {
    this.thumbnailInput.nativeElement.click();
  }

  // ===========================================
  // CHIEF GUESTS
  // ===========================================
  toggleChiefGuest(guestControl: any): void {
    const visibleValue = guestControl.get('visible')?.value;
    guestControl.patchValue({ visible: !visibleValue });
  }

  replaceChiefGuest(index: number): void {
    this.selectedGuestIndex = index;
    this.guestInput.nativeElement.click();
  }

  deleteChiefGuest(index: number): void {
    const guestName = this.chiefGuestsArray.at(index).get('name')?.value || `Guest #${index + 1}`;
    const confirmDelete = confirm(`Are you sure you want to delete ${guestName}?`);
    if (confirmDelete) {
      this.chiefGuestsArray.removeAt(index);
    }
  }

  addChiefGuest(): void {
    this.chiefGuestsArray.push(this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      visible: [true],
      detail1: ['', Validators.required],
      detail2: ['', Validators.required]
    }));
  }

  // ===========================================
  // GALLERY IMAGES
  // ===========================================
  toggleGalleryImage(imageControl: any): void {
    const visibleValue = imageControl.get('visible')?.value;
    imageControl.patchValue({ visible: !visibleValue });
  }

  replaceGalleryImage(index: number): void {
    this.selectedGalleryImageIndex = index;
    this.galleryInput.nativeElement.click();
  }

  deleteGalleryImage(index: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this gallery image?');
    if (confirmDelete) {
      this.galleryImagesArray.removeAt(index);
    }
  }

  addGalleryImage(): void {
    this.selectedGalleryImageIndex = null;
    this.galleryInput.nativeElement.click();
  }

  onThumbnailSelected(event: any): void {
    // Step: File selection
    const file = event.target.files[0];
    if (!file) return;

    if (!this.validateImage(file)) {
      this.errorMessage = `Thumbnail file "${file.name}" is invalid or exceeds 5 MB. Allowed formats: JPG, JPEG, PNG, WEBP, GIF.`;
      event.target.value = '';
      return;
    }

    this.thumbnailFile = file;
    this.errorMessage = '';
    const reader = new FileReader();
    reader.onload = () => {
      this.eventForm.patchValue({ thumbnail: reader.result as string });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  onGuestSelected(event: any): void {
    // Step: File selection
    const file = event.target.files[0];
    if (!file || this.selectedGuestIndex === null) return;

    if (!this.validateImage(file)) {
      this.errorMessage = `Guest photo file "${file.name}" is invalid or exceeds 5 MB. Allowed formats: JPG, JPEG, PNG, WEBP, GIF.`;
      event.target.value = '';
      return;
    }

    this.chiefGuestFiles[this.selectedGuestIndex!] = file;
    this.errorMessage = '';
    const reader = new FileReader();
    reader.onload = () => {
      this.chiefGuestsArray.at(this.selectedGuestIndex!).patchValue({
        image: reader.result as string
      });
      this.selectedGuestIndex = null;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  onGallerySelected(event: any): void {
    // Step: File selection
    const file = event.target.files[0];
    if (!file) return;

    if (!this.validateImage(file)) {
      this.errorMessage = `Gallery image file "${file.name}" is invalid or exceeds 5 MB. Allowed formats: JPG, JPEG, PNG, WEBP, GIF.`;
      event.target.value = '';
      return;
    }

    if (this.selectedGalleryImageIndex !== null) {
      this.galleryFiles[this.selectedGalleryImageIndex] = file;
    } else {
      const newIndex = this.galleryImagesArray.length;
      this.galleryFiles[newIndex] = file;
    }

    this.errorMessage = '';
    const reader = new FileReader();
    reader.onload = () => {
      if (this.selectedGalleryImageIndex !== null) {
        this.galleryImagesArray.at(this.selectedGalleryImageIndex).patchValue({
          image: reader.result as string
        });
        this.selectedGalleryImageIndex = null;
      } else {
        this.galleryImagesArray.push(this.fb.group({
          id: [this.galleryImagesArray.length + 1],
          image: [reader.result as string, Validators.required],
          visible: [true]
        }));
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  // ===========================================
  // Thumb Edit
  // ===========================================
  openThumbnailEditor(): void {
    this.showAdvancedEditor = true;
    this.changeThumbnail();
  }

  dropGuests(event: CdkDragDrop<any[]>): void {
    const arr = this.chiefGuestsArray;
    const dir = event.currentIndex - event.previousIndex;
    if (dir === 0) return;

    const movingControl = arr.at(event.previousIndex);
    arr.removeAt(event.previousIndex);
    arr.insert(event.currentIndex, movingControl);

    const guestFilesArray: (File | undefined)[] = [];
    for (let i = 0; i < arr.length + 1; i++) {
      guestFilesArray.push(this.chiefGuestFiles[i]);
    }
    const [moved] = guestFilesArray.splice(event.previousIndex, 1);
    guestFilesArray.splice(event.currentIndex, 0, moved);
    
    this.chiefGuestFiles = {};
    guestFilesArray.forEach((f, idx) => {
      if (f) this.chiefGuestFiles[idx] = f;
    });
  }

  dropGallery(event: CdkDragDrop<any[]>): void {
    const arr = this.galleryImagesArray;
    const dir = event.currentIndex - event.previousIndex;
    if (dir === 0) return;

    const movingControl = arr.at(event.previousIndex);
    arr.removeAt(event.previousIndex);
    arr.insert(event.currentIndex, movingControl);

    const galleryFilesArray: (File | undefined)[] = [];
    for (let i = 0; i < arr.length + 1; i++) {
      galleryFilesArray.push(this.galleryFiles[i]);
    }
    const [moved] = galleryFilesArray.splice(event.previousIndex, 1);
    galleryFilesArray.splice(event.currentIndex, 0, moved);
    
    this.galleryFiles = {};
    galleryFilesArray.forEach((f, idx) => {
      if (f) this.galleryFiles[idx] = f;
    });
  }

  // ===========================================
  // VALIDATIONS
  // ===========================================
  validateImage(base64OrFile: any): boolean {
    if (!base64OrFile) return false;

    if (base64OrFile instanceof File) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(base64OrFile.type)) return false;
      if (base64OrFile.size > 5 * 1024 * 1024) return false;
      return true;
    }

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

    if (typeof base64OrFile === 'string' && (base64OrFile.startsWith('http://') || base64OrFile.startsWith('https://'))) {
      return true;
    }

    return false;
  }

  // --- Inline validation checks ---
  get isTitleInvalid(): boolean {
    const control = this.eventForm.get('title');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get isTitleDuplicate(): boolean {
    const titleVal = this.eventForm.get('title')?.value?.trim().toLowerCase();
    if (!titleVal) return false;
    return this.eventsList.some(e => e.id !== this.event?.id && e.title.trim().toLowerCase() === titleVal);
  }

  get isQuoteInvalid(): boolean {
    const control = this.eventForm.get('quote');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get isThumbnailInvalid(): boolean {
    const control = this.eventForm.get('thumbnail');
    return !!(control && control.invalid);
  }

  get isGuestsInvalid(): boolean {
    return this.chiefGuestsArray.invalid;
  }

  get isGalleryInvalid(): boolean {
    // Gallery must have at least 10 images
    return this.galleryImagesArray.length < 10 || this.galleryImagesArray.invalid;
  }

  get isFormValid(): boolean {
    return (
      this.eventForm.valid &&
      !this.isTitleDuplicate &&
      this.galleryImagesArray.length >= 10
    );
  }

  // ===========================================
  // SAVE
  // ===========================================
  async saveChanges(): Promise<void> {
    if (this.eventForm.get('title')?.invalid) {
      this.errorMessage = 'Please enter the Event Title.';
      return;
    }

    if (this.isTitleDuplicate) {
      this.errorMessage = 'An event with this title already exists.';
      return;
    }

    if (this.eventForm.get('quote')?.invalid) {
      this.errorMessage = 'Please enter the Event Quote.';
      return;
    }

    if (this.eventForm.get('thumbnail')?.invalid) {
      this.errorMessage = 'Please upload the Event Thumbnail.';
      return;
    }

    if (this.chiefGuestsArray.invalid) {
      this.errorMessage = 'Every Chief Guest must have a Photo, Name, Detail 1 and Detail 2.';
      return;
    }

    if (this.galleryImagesArray.length < 10) {
      this.errorMessage = 'Please upload at least 10 gallery images.';
      return;
    }

    this.errorMessage = '';

    try {
      console.log('--- START RESIZING EVENT IMAGES BEFORE UPLOAD ---');
      // Step: FormData creation
      const formData = new FormData();

      // Resize Thumbnail File
      if (this.thumbnailFile) {
        // Step: Upload preparation
        const blob = await this.resizeImage(this.thumbnailFile);
        formData.append('thumbnail', blob, this.thumbnailFile.name);
      }

      // Resize Chief Guest Files
      for (const indexStr of Object.keys(this.chiefGuestFiles)) {
        const index = Number(indexStr);
        const file = this.chiefGuestFiles[index];
        if (file) {
          // Step: Upload preparation
          const blob = await this.resizeImage(file);
          formData.append('chiefGuests[]', blob, file.name);
        }
      }

      // Resize Gallery Files
      for (const indexStr of Object.keys(this.galleryFiles)) {
        const index = Number(indexStr);
        const file = this.galleryFiles[index];
        if (file) {
          // Step: Upload preparation
          const blob = await this.resizeImage(file);
          formData.append('gallery[]', blob, file.name);
        }
      }
      console.log('--- END RESIZING EVENT IMAGES BEFORE UPLOAD ---');
    } catch (e) {
      console.error('Error processing event images resizing:', e);
    }

    const formValue = this.eventForm.value;
    const updatedEvent: Event = {
      ...this.event,
      title: formValue.title || '',
      quote: formValue.quote || '',
      thumbnail: formValue.thumbnail || '',
      chiefGuests: (formValue.chiefGuests || []).map((cg: any) => ({
        name: cg.name,
        image: cg.image,
        visible: cg.visible,
        designation: cg.detail1,
        organization: cg.detail2
      })),
      galleryImages: (formValue.galleryImages || []).map((img: any) => ({
        id: img.id,
        image: img.image,
        visible: img.visible
      })),
      totalPhotos: (formValue.galleryImages || []).length
    };

    this.galleryService.updateEvent(updatedEvent);
    this.originalEventJson = JSON.stringify(this.eventForm.value);

    alert('Changes saved successfully!');
    this.router.navigate(['/gallery']);
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