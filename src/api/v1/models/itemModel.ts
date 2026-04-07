export interface Item {
  id: string;
  name: string;
  description: string;
  locationId: string;
  status: "lost" | "found" | "claimed";
  createdAt: String;
}
