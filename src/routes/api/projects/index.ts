
export interface GetProjectsResponse {
  id: string;
  name: string;
  displayName: string; // Note: You might have a typo here — see below
  lastUpdated: Date;
  services: any[]; // Replace `any` with a more specific type once services are defined
  active: boolean;
}[];
