import { AllMvCostumes } from "./costumesMv.ts";
import { AllSpecialCostumes } from "./costumesSpecial.ts";
import { AllStageCostumes } from "./costumesStage.ts";
import { AllTShirtCostumes } from "./costumesTshirt.ts";
import { Costume } from "./types.ts";

export const AllCostumes: Costume[] = [
  ...AllStageCostumes,
  ...AllMvCostumes,
  ...AllTShirtCostumes,
  ...AllSpecialCostumes,
];
