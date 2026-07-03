import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
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
    "Founder's Day": { hasCount: true, count: 100, prefix: "Our Founder's ", suffix: "th Birthday" },
    "Founders Day": { hasCount: true, count: 100, prefix: "Our Founder's ", suffix: "th Birthday" },
    "Annual Day": { hasCount: true, count: 36, prefix: "Crossing ", suffix: "th Educational Excellency" },
    "Deepavali": { hasCount: false, prefix: "Celebrated Deepavali with Souco Group", suffix: "" },
    "Republic Day": { hasCount: true, count: 77, prefix: "Celebrated ", suffix: "th Republic Day" },
    "Independence Day": { hasCount: true, count: 77, prefix: "Celebrated ", suffix: "th Independence Day" },
    "Special Events": { hasCount: true, count: 5, prefix: "Adding ", suffix: " more Classes with the help of our Contributors" },
    "Special Event": { hasCount: true, count: 5, prefix: "Adding ", suffix: " more Classes with the help of our Contributors" },
    "Graduation Day": { hasCount: false, prefix: "Our Little Graduates", suffix: "" },
    "Smart Class Room": { hasCount: false, prefix: "We added New Smart Class Room", suffix: "" },
    "Smart Classroom": { hasCount: false, prefix: "We added New Smart Class Room", suffix: "" },
    "Special Occasion": { hasCount: false, prefix: "Celebrating Moments, Creating Memories", suffix: "" },
    "Sports Day": { hasCount: true, count: 36, prefix: "Celebrated ", suffix: "th Sports Day" },
    "Science Exhibition": { hasCount: false, prefix: "Showcasing Innovation and Creativity", suffix: "" }
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

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {}

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

  get currentEventQuote(): string {
    if (this.selectedEventTitle === 'Other Events') {
      return this.customEventQuote || '';
    }
    const config = this.eventQuotes[this.selectedEventTitle];
    if (!config) return '';
    if (config.hasCount) {
      return `${config.prefix}${config.count || 0}${config.suffix}`;
    }
    return config.prefix;
  }

  get activeEventCount(): number {
    const config = this.eventQuotes[this.selectedEventTitle];
    return config && config.hasCount ? config.count : 0;
  }

  set activeEventCount(val: number) {
    const config = this.eventQuotes[this.selectedEventTitle];
    if (config && config.hasCount) {
      config.count = val;
    }
  }

  incrementCount(): void {
    const config = this.eventQuotes[this.selectedEventTitle];
    if (config && config.hasCount) {
      config.count = (config.count || 0) + 1;
      this.cdr.detectChanges();
    }
  }

  decrementCount(): void {
    const config = this.eventQuotes[this.selectedEventTitle];
    if (config && config.hasCount && config.count > 1) {
      config.count = (config.count || 0) - 1;
      this.cdr.detectChanges();
    }
  }

  onCountChange(): void {
    const config = this.eventQuotes[this.selectedEventTitle];
    if (config && config.hasCount) {
      if (config.count < 1) {
        config.count = 1;
      }
      this.cdr.detectChanges();
    }
  }

  resetQuotes(): void {
    this.customEventQuote = '';
    this.eventQuotes = {
      "Founder's Day": { hasCount: true, count: 100, prefix: "Our Founder's ", suffix: "th Birthday" },
      "Founders Day": { hasCount: true, count: 100, prefix: "Our Founder's ", suffix: "th Birthday" },
      "Annual Day": { hasCount: true, count: 36, prefix: "Crossing ", suffix: "th Educational Excellency" },
      "Deepavali": { hasCount: false, prefix: "Celebrated Deepavali with Souco Group", suffix: "" },
      "Republic Day": { hasCount: true, count: 77, prefix: "Celebrated ", suffix: "th Republic Day" },
      "Independence Day": { hasCount: true, count: 77, prefix: "Celebrated ", suffix: "th Independence Day" },
      "Special Events": { hasCount: true, count: 5, prefix: "Adding ", suffix: " more Classes with the help of our Contributors" },
      "Special Event": { hasCount: true, count: 5, prefix: "Adding ", suffix: " more Classes with the help of our Contributors" },
      "Graduation Day": { hasCount: false, prefix: "Our Little Graduates", suffix: "" },
      "Smart Class Room": { hasCount: false, prefix: "We added New Smart Class Room", suffix: "" },
      "Smart Classroom": { hasCount: false, prefix: "We added New Smart Class Room", suffix: "" },
      "Special Occasion": { hasCount: false, prefix: "Celebrating Moments, Creating Memories", suffix: "" },
      "Sports Day": { hasCount: true, count: 36, prefix: "Celebrated ", suffix: "th Sports Day" },
      "Science Exhibition": { hasCount: false, prefix: "Showcasing Innovation and Creativity", suffix: "" }
    };
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

  submitEvent(): void {
    this.errorMessage = '';
    const finalTitle = this.selectedEventTitle === 'Other Events' ? this.customEventTitle.trim() : this.selectedEventTitle;

    if (!finalTitle) {
      this.errorMessage = 'Please select or specify a category event title.';
      this.cdr.detectChanges();
      return;
    }

    const payload = {
      title: finalTitle,
      quote: this.currentEventQuote,
      chiefGuests: this.chiefGuests,
      gallery: this.otherPhotos
    };

    console.log('Saved Event Details:', payload);
    alert('Event details saved successfully!');
    this.resetForm();
  }
}