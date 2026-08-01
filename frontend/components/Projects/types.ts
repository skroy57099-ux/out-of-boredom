export interface ProjectStat {
  label: string;
  value: string;
}

export interface GalleryItem {
  image: string;
  title: string;
  subtitle: string;
}

export interface Project {
  id: string;
  title: string;
  icon: string;

  shortDescription: string;
  longDescription: string;

  category: string;

  technologies: string[];

  featured: boolean;

  status: "Completed" | "In Progress";

  github: string;
  route: string;

  demo?: string;

  stats: ProjectStat[];

  gallery: GalleryItem[];
}
