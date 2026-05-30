export interface User {
  id: number;
  email: string;
  name: string;
  initials: string;
  plan: "Free" | "Pro" | "Team";
  city: string;
  joined: string;
  active: boolean;
  avatar?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}
