import { AllMvCostumes } from "./costumesMv";
import { AllSpecialCostumes } from "./costumesSpecial";
import { AllStageCostumes } from "./costumesStage";
import { AllTShirtCostumes } from "./costumesTshirt";
import { AllUniformCostumes } from "./costumesUniform";
import { Costume } from "./types";

export const AllCostumes: Costume[] = [
  ...AllStageCostumes,
  ...AllUniformCostumes,
  ...AllMvCostumes,
  ...AllTShirtCostumes,
  ...AllSpecialCostumes,
];
