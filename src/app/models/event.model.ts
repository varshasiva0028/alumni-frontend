export interface ChiefGuest {

  name: string;

  image: string;

  visible: boolean;

  detail1?: string;

  detail2?: string;

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