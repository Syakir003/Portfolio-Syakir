export interface Project {
  title: string;
  date: string;
  image: string;
  description: string;
}

export interface Experience {
  title: string;
  organization: string;
  date: string;
  images: string[];
  description?: string;
}

export interface Education {
  school: string;
  major: string;
  date: string;
  image: string;
  description?: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  image: string;
  description?: string;
}
