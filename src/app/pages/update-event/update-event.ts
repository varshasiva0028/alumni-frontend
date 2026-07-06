import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-update-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule
  ], templateUrl: './update-event.html',
  styleUrl: './update-event.css'
})
export class UpdateEventComponent {

  showAdvancedEditor = false;
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private galleryService: GalleryService
  ) { }
  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    const event = this.galleryService.getEventById(id);

    if (event) {

      // Create a copy so editing doesn't immediately change the service data
      this.event = structuredClone(event);

    }

  }

  // ===========================================
  // BACK
  // ===========================================

  back(): void {

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

    this.event.chiefGuests.splice(index, 1);

  }

  addChiefGuest(): void {

    this.event.chiefGuests.push({

      name: 'New Chief Guest',

      image: 'https://i.pravatar.cc/500',

      visible: true,

      designation: '',

      organization: ''

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

    this.event.galleryImages.splice(index, 1);

  }

  addGalleryImage(): void {

    this.selectedGalleryImage = null;

    this.galleryInput.nativeElement.click();

  }

  onThumbnailSelected(event: any): void {

    const file = event.target.files[0];

    if (!file) return;

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
  // SAVE
  // ===========================================

  saveChanges(): void {

    this.event.totalPhotos = this.event.galleryImages.length;

    this.galleryService.updateEvent(this.event);

    alert('Changes Saved Successfully');

    this.router.navigate(['/gallery']);

  }

}