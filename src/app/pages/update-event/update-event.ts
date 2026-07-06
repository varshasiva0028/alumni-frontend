import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-event.html',
  styleUrl: './update-event.css'
})
export class UpdateEventComponent {

  // ===========================================
  // ADVANCED EDITOR
  // ===========================================

  showAdvancedEditor = false;

  // ===========================================
  // EVENT
  // ===========================================

  event: any;

  constructor(private router: Router) {

    const stateEvent = history.state.event;

    this.event = {

      id: stateEvent?.id ?? 0,

      title: stateEvent?.title ?? '',

      quote: stateEvent?.quote ?? '',

      thumbnail: stateEvent?.thumbnail ?? '',

      visible: stateEvent?.visible ?? true,

      chiefGuests: (stateEvent?.chiefGuests || []).map(
        (guest: any, index: number) => ({

          name: guest.name || `Chief Guest ${index + 1}`,

          image: guest.image,

          visible: guest.visible ?? true

        })
      ),

      galleryImages:

        stateEvent?.galleryImages ??

        (stateEvent?.images || []).map(
          (img: string, index: number) => ({

            id: index + 1,

            image: img,

            visible: true

          })
        )

    };

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
  // EVENT VISIBILITY
  // ===========================================

  toggleVisibility(): void {

    this.event.visible = !this.event.visible;

  }

  // ===========================================
  // THUMBNAIL
  // ===========================================

  changeThumbnail(): void {

    alert('Replace Thumbnail');

  }

  // ===========================================
  // CHIEF GUESTS
  // ===========================================

  toggleChiefGuest(guest: any): void {

    guest.visible = !guest.visible;

  }

  replaceChiefGuest(guest: any): void {

    alert('Replace ' + guest.name);

  }

  deleteChiefGuest(index: number): void {

    this.event.chiefGuests.splice(index, 1);

  }

  addChiefGuest(): void {

    this.event.chiefGuests.push({

      name: 'New Chief Guest',

      image: 'https://i.pravatar.cc/500',

      visible: true

    });

  }

  // ===========================================
  // GALLERY IMAGES
  // ===========================================

  toggleGalleryImage(image: any): void {

    image.visible = !image.visible;

  }

  replaceGalleryImage(image: any): void {

    alert('Replace Gallery Image');

  }

  deleteGalleryImage(index: number): void {

    this.event.galleryImages.splice(index, 1);

  }

  addGalleryImage(): void {

    this.event.galleryImages.push({

      id: this.event.galleryImages.length + 1,

      image: `https://picsum.photos/600/400?random=${this.event.galleryImages.length + 100}`,

      visible: true

    });

  }

  // ===========================================
  // SAVE
  // ===========================================

  saveChanges(): void {

    console.log(this.event);

    alert('Changes Saved Successfully');

    this.router.navigate(['/gallery']);

  }

}