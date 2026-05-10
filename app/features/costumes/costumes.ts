import { AllMvCostumes } from "./costumesMv";
import { AllSpecialCostumes } from "./costumesSpecial";
import { AllStageCostumes } from "./costumesStage";
import { AllTShirtCostumes } from "./costumesTshirt";
import { Costume } from "./types";

export const AllCostumes: Costume[] = [
  ...AllStageCostumes,
  ...AllMvCostumes,
  ...AllTShirtCostumes,
  ...AllSpecialCostumes,
];
