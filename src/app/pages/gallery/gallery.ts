import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../services/gallery.service';

interface ChiefGuest {
  name: string;
  image: string;
  visible: boolean;
}

interface GalleryEvent {
  id: number;
  title: string;
  quote: string;
  thumbnail: string;
  totalPhotos: number;
  chiefGuests: ChiefGuest[];
  images: string[];
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css']
})
export class GalleryComponent {

  constructor(
    private router: Router,
    private galleryService: GalleryService
  ) { }
  ngOnInit(): void {

  console.log(this.galleryService.getEvents());

}
  // ============================
  // DUMMY EVENTS
  // ============================

  galleryEvents: GalleryEvent[] = [

    {
      id: 1,
      title: 'Annual Day',
      quote: 'Crossing 36th Educational Excellency',
      thumbnail: 'https://picsum.photos/800/500?1',
      totalPhotos: 80,

      chiefGuests: [
        {
          name: 'Chief Guest 1',
          image: 'https://i.pravatar.cc/600?img=11',
          visible: true
        },
        {
          name: 'Chief Guest 2',
          image: 'https://i.pravatar.cc/600?img=12',
          visible: true
        }
      ],

      images: Array.from(
        { length: 80 },
        (_, i) => `https://picsum.photos/600/400?random=${i + 1}`
      )
    },

    {
      id: 2,
      title: 'Republic Day',
      quote: 'Celebrated 77th Republic Day',
      thumbnail: 'https://picsum.photos/800/500?2',
      totalPhotos: 40,

      chiefGuests: [
        {
          name: 'Chief Guest 1',
          image: 'https://i.pravatar.cc/600?img=13',
          visible: true
        },
        {
          name: 'Chief Guest 2',
          image: 'https://i.pravatar.cc/600?img=14',
          visible: true
        }
      ],

      images: Array.from(
        { length: 40 },
        (_, i) => `https://picsum.photos/600/400?random=${i + 100}`
      )
    },

    {
      id: 3,
      title: 'Independence Day',
      quote: 'Celebrated 79th Independence Day',
      thumbnail: 'https://picsum.photos/800/500?3',
      totalPhotos: 40,

      chiefGuests: [
        {
          name: 'Chief Guest 1',
          image: 'https://i.pravatar.cc/600?img=15',
          visible: true
        },
        {
          name: 'Chief Guest 2',
          image: 'https://i.pravatar.cc/600?img=16',
          visible: true
        }
      ],

      images: Array.from(
        { length: 40 },
        (_, i) => `https://picsum.photos/600/400?random=${i + 200}`
      )
    },

    {
      id: 4,
      title: "Founder's Day",
      quote: "Our Founder's 100th Birthday",
      thumbnail: 'https://picsum.photos/800/500?4',
      totalPhotos: 40,

      chiefGuests: [
        {
          name: 'Chief Guest 1',
          image: 'https://i.pravatar.cc/600?img=17',
          visible: true
        },
        {
          name: 'Chief Guest 2',
          image: 'https://i.pravatar.cc/600?img=18',
          visible: true
        }
      ],

      images: Array.from(
        { length: 40 },
        (_, i) => `https://picsum.photos/600/400?random=${i + 300}`
      )
    },
    {
      id: 5,
      title: 'Sports Day',
      quote: 'Celebrated 36th Sports Day',
      thumbnail: 'https://picsum.photos/800/500?5',
      totalPhotos: 40,

      chiefGuests: [
        {
          name: 'Chief Guest 1',
          image: 'https://i.pravatar.cc/600?img=19',
          visible: true
        },
        {
          name: 'Chief Guest 2',
          image: 'https://i.pravatar.cc/600?img=20',
          visible: true
        }
      ],

      images: Array.from(
        { length: 40 },
        (_, i) => `https://picsum.photos/600/400?random=${i + 400}`
      )
    },

    {
      id: 6,
      title: 'Science Exhibition',
      quote: 'Showcasing Innovation and Creativity',
      thumbnail: 'https://picsum.photos/800/500?6',
      totalPhotos: 40,

      chiefGuests: [
        {
          name: 'Chief Guest 1',
          image: 'https://i.pravatar.cc/600?img=21',
          visible: true
        },
        {
          name: 'Chief Guest 2',
          image: 'https://i.pravatar.cc/600?img=22',
          visible: true
        }
      ],

      images: Array.from(
        { length: 40 },
        (_, i) => `https://picsum.photos/600/400?random=${i + 500}`
      )
    },

    {
      id: 7,
      title: 'Deepavali',
      quote: 'Celebrating the Festival of Lights Together',
      thumbnail: 'https://picsum.photos/800/500?7',
      totalPhotos: 40,

      chiefGuests: [
        {
          name: 'Chief Guest 1',
          image: 'https://i.pravatar.cc/600?img=23',
          visible: true
        },
        {
          name: 'Chief Guest 2',
          image: 'https://i.pravatar.cc/600?img=24',
          visible: true
        }
      ],

      images: Array.from(
        { length: 40 },
        (_, i) => `https://picsum.photos/600/400?random=${i + 600}`
      )
    },

    {
      id: 8,
      title: 'Graduation Day',
      quote: 'Honouring Our Young Graduates',
      thumbnail: 'https://picsum.photos/800/500?8',
      totalPhotos: 40,

      chiefGuests: [
        {
          name: 'Chief Guest 1',
          image: 'https://i.pravatar.cc/600?img=25',
          visible: true
        },
        {
          name: 'Chief Guest 2',
          image: 'https://i.pravatar.cc/600?img=26',
          visible: true
        }
      ],

      images: Array.from(
        { length: 40 },
        (_, i) => `https://picsum.photos/600/400?random=${i + 700}`
      )
    },

    {
      id: 9,
      title: 'Special Events',
      quote: 'Creating Memorable Moments Together',
      thumbnail: 'https://picsum.photos/800/500?9',
      totalPhotos: 40,

      chiefGuests: [
        {
          name: 'Chief Guest 1',
          image: 'https://i.pravatar.cc/600?img=27',
          visible: true
        },
        {
          name: 'Chief Guest 2',
          image: 'https://i.pravatar.cc/600?img=28',
          visible: true
        }
      ],

      images: Array.from(
        { length: 40 },
        (_, i) => `https://picsum.photos/600/400?random=${i + 800}`
      )
    },

    {
      id: 10,
      title: 'Special Occasion',
      quote: 'Celebrating Every Special Milestone',
      thumbnail: 'https://picsum.photos/800/500?10',
      totalPhotos: 40,

      chiefGuests: [
        {
          name: 'Chief Guest 1',
          image: 'https://i.pravatar.cc/600?img=29',
          visible: true
        },
        {
          name: 'Chief Guest 2',
          image: 'https://i.pravatar.cc/600?img=30',
          visible: true
        }
      ],

      images: Array.from(
        { length: 40 },
        (_, i) => `https://picsum.photos/600/400?random=${i + 900}`
      )
    },

    {
      id: 11,
      title: 'Smart Class Room',
      quote: 'Empowering Learning Through Technology',
      thumbnail: 'https://picsum.photos/800/500?11',
      totalPhotos: 40,

      chiefGuests: [
        {
          name: 'Chief Guest 1',
          image: 'https://i.pravatar.cc/600?img=31',
          visible: true
        },
        {
          name: 'Chief Guest 2',
          image: 'https://i.pravatar.cc/600?img=32',
          visible: true
        }
      ],

      images: Array.from(
        { length: 40 },
        (_, i) => `https://picsum.photos/600/400?random=${i + 1000}`
      )
    }

  ];
  // ============================
  // OPEN GALLERY
  // ============================

  openGallery(event: GalleryEvent): void {

    this.router.navigate(
      ['/gallery', event.id],
      {
        state: {
          event: event
        }
      }
    );

  }

  // ============================
  // ADD NEW EVENT
  // ============================

  addNewEvent(): void {

    this.router.navigate(['/events']);

  }

  // ============================
  // EDIT EVENT
  // ============================

  editEvent(event: GalleryEvent): void {

    this.router.navigate(
      ['/update-event', event.id],
      {
        state: {
          event: event
        }
      }
    );

  }

}