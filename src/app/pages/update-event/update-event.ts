import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GalleryService } from '../../services/gallery.service';
import { Event } from '../../models/event.model';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray
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
    FormsModule,
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
  selectedGuest: any = null;
  selectedGalleryImage: any = null;

  // Unsaved changes state tracking
  originalEventJson = '';

  // All events list for title duplicate checking
  eventsList: Event[] = [];

  // Programmatic FormControls utilizing Angular Validators
  titleControl = new FormControl('', [Validators.required]);
  quoteControl = new FormControl('', [Validators.required]);
  guestNameControl = new FormControl('', [Validators.required]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private galleryService: GalleryService
  ) { }

  ngOnInit(): void {
    // Load events list for title duplicate checking
    this.galleryService.getEvents().subscribe(events => {
      this.eventsList = events;
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    const event = this.galleryService.getEventById(id);
    if (event) {
      // Create a copy so editing doesn't immediately change the service data
      this.event = structuredClone(event);
      this.originalEventJson = JSON.stringify(this.event);
    }
  }

  // Prevent accidental reload or navigation with unsaved edits
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.hasUnsavedChanges()) {
      $event.returnValue = true;
    }
  }

  hasUnsavedChanges(): boolean {
    return this.originalEventJson !== JSON.stringify(this.event);
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
    return this.event.galleryImages.filter(
      (img: any) => img.visible
    ).length;
  }

  getHiddenCount(): number {
    return this.event.galleryImages.filter(
      (img: any) => !img.visible
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
  toggleChiefGuest(guest: any): void {
    guest.visible = !guest.visible;
  }

  replaceChiefGuest(guest: any): void {
    this.selectedGuest = guest;
    this.guestInput.nativeElement.click();
  }

  deleteChiefGuest(index: number): void {
    const guestName = this.event.chiefGuests[index]?.name || 'this guest';
    const confirmDelete = confirm(`Are you sure you want to delete ${guestName}?`);
    if (confirmDelete) {
      this.event.chiefGuests.splice(index, 1);
    }
  }

  addChiefGuest(): void {
    this.event.chiefGuests.push({
      name: '',
      image: '',
      visible: true,
      detail1: '',
      detail2: ''
    });
  }

  // ===========================================
  // GALLERY IMAGES
  // ===========================================
  toggleGalleryImage(image: any): void {
    image.visible = !image.visible;
  }

  replaceGalleryImage(image: any): void {
    this.selectedGalleryImage = image;
    this.galleryInput.nativeElement.click();
  }

  deleteGalleryImage(index: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this gallery image?');
    if (confirmDelete) {
      this.event.galleryImages.splice(index, 1);
    }
  }

  addGalleryImage(): void {
    this.selectedGalleryImage = null;
    this.galleryInput.nativeElement.click();
  }

  onThumbnailSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.validateImage(file)) {
      this.errorMessage = `Thumbnail file "${file.name}" is invalid or exceeds 5 MB. Allowed formats: JPG, JPEG, PNG, WEBP, GIF.`;
      event.target.value = '';
      return;
    }

    this.errorMessage = '';
    const reader = new FileReader();
    reader.onload = () => {
      this.event.thumbnail = reader.result as string;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  onGuestSelected(event: any): void {
    const file = event.target.files[0];
    if (!file || !this.selectedGuest) return;

    if (!this.validateImage(file)) {
      this.errorMessage = `Guest photo file "${file.name}" is invalid or exceeds 5 MB. Allowed formats: JPG, JPEG, PNG, WEBP, GIF.`;
      event.target.value = '';
      return;
    }

    this.errorMessage = '';
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedGuest.image = reader.result as string;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  onGallerySelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.validateImage(file)) {
      this.errorMessage = `Gallery image file "${file.name}" is invalid or exceeds 5 MB. Allowed formats: JPG, JPEG, PNG, WEBP, GIF.`;
      event.target.value = '';
      return;
    }

    this.errorMessage = '';
    const reader = new FileReader();
    reader.onload = () => {
      if (this.selectedGalleryImage) {
        this.selectedGalleryImage.image = reader.result as string;
      } else {
        this.event.galleryImages.push({
          id: this.event.galleryImages.length + 1,
          image: reader.result as string,
          visible: true
        });
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
    moveItemInArray(
      this.event.chiefGuests,
      event.previousIndex,
      event.currentIndex
    );
  }

  dropGallery(event: CdkDragDrop<any[]>): void {
    moveItemInArray(
      this.event.galleryImages,
      event.previousIndex,
      event.currentIndex
    );
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
    if (!this.event || !this.event.title) return true;
    this.titleControl.setValue(this.event.title);
    return this.titleControl.invalid;
  }

  get isTitleDuplicate(): boolean {
    if (!this.event || !this.event.title) return false;
    const currentTitle = this.event.title.trim().toLowerCase();
    return this.eventsList.some(e => e.id !== this.event.id && e.title.trim().toLowerCase() === currentTitle);
  }

  get isQuoteInvalid(): boolean {
    if (!this.event || !this.event.quote) return true;
    this.quoteControl.setValue(this.event.quote);
    return this.quoteControl.invalid;
  }

  get isThumbnailInvalid(): boolean {
    if (!this.event || !this.event.thumbnail) return true;
    return !this.validateImage(this.event.thumbnail);
  }

  isGuestInvalid(guest: any): boolean {
    if (!guest) return true;
    if (!guest.image || !this.validateImage(guest.image)) return true;
    if (!guest.name || !guest.name.trim()) return true;
    if (!guest.detail1 || !guest.detail1.trim()) return true;
    if (!guest.detail2 || !guest.detail2.trim()) return true;
    return false;
  }

  get isGuestsInvalid(): boolean {
    if (!this.event || !this.event.chiefGuests) return false;
    return this.event.chiefGuests.some(g => this.isGuestInvalid(g));
  }

  get isGalleryInvalid(): boolean {
    if (!this.event || !this.event.galleryImages) return true;
    // Gallery must have at least 10 images
    if (this.event.galleryImages.length < 10) return true;
    return this.event.galleryImages.some(img => !this.validateImage(img.image));
  }

  get isFormValid(): boolean {
    return (
      this.event &&
      !this.isTitleInvalid &&
      !this.isTitleDuplicate &&
      !this.isQuoteInvalid &&
      !this.isThumbnailInvalid &&
      !this.isGuestsInvalid &&
      !this.isGalleryInvalid
    );
  }

  // ===========================================
  // SAVE
  // ===========================================
  saveChanges(): void {
    if (!this.isFormValid) {
      this.errorMessage = 'Please fix form validation errors before saving.';
      return;
    }

    this.event.totalPhotos = this.event.galleryImages.length;
    this.galleryService.updateEvent(this.event);
    
    // Clear unsaved warning state
    this.originalEventJson = JSON.stringify(this.event);

    alert('Changes Saved Successfully');
    this.router.navigate(['/gallery']);
  }
}