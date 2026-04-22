export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  languages: Language[];
  skills: Skills;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  tagline?: string;
  availability?: string;
  social: {
    linkedin: string;
    github: string;
    website: string;
    portfolio: string;
  };
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  website: string;
  technologies: string[];
  tools: string[];
  description: string[];
}

export interface Project {
  id: string;
  name: string;
  year: string;
  description: string;
  technologies: string[];
  link: string;
  type?: string;
  featured?: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  location: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface Skills {
  programming: string[];
  gameAndCreativeTech: string[];
  productAndManagement: string[];
}


