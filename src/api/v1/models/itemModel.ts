export type itemStatus = "lost" | "found" | "claimed";

export interface Item {
  id: string;
  name: string;
  description: string;
  locationId: string;
  status: itemStatus;
  createdAt: string;
  updatedAt?: string; // this is an optional part, used in updateItem
  imageUrl?: string;
}
