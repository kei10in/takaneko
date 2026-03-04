export type PhotoType = "artist" | "press" | "none";

export interface StageCostume {
  kind: "stage";
  name: string;
  photoType: PhotoType;

  stylist?: {
    name: string;
    socialMedia?: { name: string; url: string }[];
  };
}

export interface MvCostume {
  kind: "mv";
  name: string;
  photoType: PhotoType;
}

export interface TShirtCostume {
  kind: "tshirt";
  name: string;
  photoType: PhotoType;
}

export interface SpecialCostume {
  kind: "special";
  name: string;
  photoType: PhotoType;
}

export type Costume = StageCostume | MvCostume | TShirtCostume | SpecialCostume;
