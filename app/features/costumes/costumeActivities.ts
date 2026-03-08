import { Act } from "../events/act";
import { EventModule } from "../events/eventModule";
import { AllStageCostumes } from "./costumesStage";
import { LivesForCostume } from "./types";

export const makeLivesForCostumes = (events: EventModule[]): LivesForCostume[] => {
  // Key は costume name
  const result: Record<string, LivesForCostume> = {};
  AllStageCostumes.forEach((costume) => {
    result[costume.name] = {
      costumeSlug: costume.slug,
      costumeName: costume.name,
      count: 0,
      lives: [],
    };
  });

  events.forEach((event) => {
    const { meta } = event;

    const costumeToActsMap: Record<string, { act: Act }[]> = {};

    meta.acts.forEach((act) => {
      act.setlist
        .filter((p) => p.kind == "costume")
        .forEach((segment) => {
          if (!costumeToActsMap[segment.costumeName]) {
            costumeToActsMap[segment.costumeName] = [];
          }
          costumeToActsMap[segment.costumeName].push({ act });
        });
    });

    Object.entries(costumeToActsMap).forEach(([costumeName, acts]) => {
      if (!result[costumeName]) {
        return;
      }

      result[costumeName].count += acts.length;
      result[costumeName].lives.push({
        event: {
          slug: event.slug,
          summary: event.meta.summary,
          title: event.meta.title,
          category: event.meta.category,
          liveType: event.meta.liveType,
          date: event.meta.date,
          region: event.meta.region,
          location: event.meta.location,
        },
        acts: acts.map(({ act }) => ({
          actTitle: act.title,
        })),
      });
    });
  });

  return Object.values(result);
};
