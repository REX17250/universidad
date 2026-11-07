export type Apod = {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  copyright?: string;
};

export type CloseApproachData = {
  close_approach_date: string;
  close_approach_date_full?: string;
  relative_velocity: { kilometers_per_hour: string; kilometers_per_second: string };
  miss_distance: { kilometers: string; lunar: string; astronomical: string };
  orbiting_body: string;
};

export type NearEarthObject = {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object: boolean;
  estimated_diameter: {
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  close_approach_data: CloseApproachData[];
  orbital_data?: {
    orbit_class?: { orbit_class_type: string; orbit_class_description: string };
    first_observation_date?: string;
    last_observation_date?: string;
  };
};

export type NeoFeedResponse = {
  element_count: number;
  near_earth_objects: Record<string, NearEarthObject[]>;
};

export type MediaLibraryLink = {
  href: string;
  rel: string;
  render?: string;
};

export type MediaLibraryItemData = {
  nasa_id: string;
  title: string;
  description?: string;
  date_created?: string;
  media_type: "image" | "video" | "audio";
  center?: string;
  keywords?: string[];
};

export type MediaLibraryItem = {
  data: MediaLibraryItemData[];
  links?: MediaLibraryLink[];
};

export type MediaLibrarySearchResponse = {
  collection: {
    items: MediaLibraryItem[];
    metadata?: { total_hits: number };
  };
};

export type EpicImage = {
  identifier: string;
  caption: string;
  image: string;
  date: string;
  centroid_coordinates: { lat: number; lon: number };
};
