export interface ChiefGuest {

  name: string;

  image: string;

  visible: boolean;

  designation?: string;

  organization?: string;

}

export interface GalleryImage {

  id: number;

  image: string;

  visible: boolean;

}

export interface Event {

  id: number;

  title: string;

  quote: string;

  thumbnail: string;

  visible: boolean;

  totalPhotos: number;

  chiefGuests: ChiefGuest[];

  galleryImages: GalleryImage[];

}