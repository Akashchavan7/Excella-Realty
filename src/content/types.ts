import type { MediaKey } from './media.generated';

export type ProjectStatus = 'ongoing' | 'upcoming' | 'completed';
export type ProjectSegment = 'residential' | 'commercial' | 'mixed';
export type CollectionId = 'autograph' | 'gold';

export type NeighbourhoodId =
  | 'bavdhan'
  | 'pimple-nilakh'
  | 'pirangut'
  | 'keshav-nagar-mundhwa'
  | 'ambegaon'
  | 'baner-sus'
  | 'dhanori-lohegaon'
  | 'wakad'
  | 'vishrantwadi';

export interface GeoPoint {
  lat: number;
  lng: number;
  /**
   * `site` — pin taken from the map embedded on Excellaa's own project page.
   * `locality` — Excellaa publishes only the locality; pin is the OpenStreetMap
   * centroid of that locality and is shown with a hollow marker.
   */
  precision: 'site' | 'locality';
}

export interface ImageItem {
  image: MediaKey;
  caption: string;
}

export interface ListGroup {
  title: string;
  items: string[];
}

export interface NearbyGroup {
  category: string;
  places: { name: string; distance?: string }[];
}

export interface Project {
  slug: string;
  name: string;
  status: ProjectStatus;
  segment: ProjectSegment;
  collection?: CollectionId;
  tagline?: string;
  configuration: string;
  locality: string;
  city: string;
  address?: string;
  neighbourhood?: NeighbourhoodId;
  rera: { number: string; label?: string }[];
  summary: string;
  story?: string[];
  facts?: { label: string; value: string }[];
  highlights?: string[];
  cover?: MediaKey;
  gallery?: ImageItem[];
  floorPlans?: ImageItem[];
  amenities?: ListGroup[];
  specifications?: ListGroup[];
  nearby?: NearbyGroup[];
  geo?: GeoPoint;
  brochure?: { href: string; label: string; size?: string };
  /** Official microsite currently linked from excellaa.com */
  microsite?: string;
  /** Joint-venture or partner note published by Excellaa */
  partners?: string;
  featured?: boolean;
  /** Short-form legacy entries have only a name, locality and photo on excellaa.com */
  legacy?: boolean;
}

export interface Neighbourhood {
  id: NeighbourhoodId;
  name: string;
  blurb: string;
  image?: MediaKey;
  center: [number, number]; // [lng, lat]
  zoom: number;
}
