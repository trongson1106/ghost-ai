export interface CollaboratorProfile {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
}

export interface OwnerProfile {
  email: string;
  name: string | null;
  imageUrl: string | null;
}
