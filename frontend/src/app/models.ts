export interface Criminal {
  id: number;
  name: string;
  country: string;
  year: number;
  crimeType: string;
  summary: string;
  imageUrl?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  nationality?: string;
  primary_crime?: string;
  status?: string;
  photo?: string | null;
}

export interface FilterOptions {
  countries: string[];
  years: number[];
  crimeTypes: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  username: string;
  email?: string;
}

export interface ApiError {
  message: string;
}

export interface CaseFile {
  id: number;
  criminal: number;
  criminal_name?: string;
  case_status: string;
  description: string;
  severity_level: string;
  created_at: string;
}

export interface Organization {
  id: number;
  name: string;
  organization_type: string;
  country_of_origin: string;
  description: string;
}