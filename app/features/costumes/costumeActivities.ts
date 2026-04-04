import { Act } from "../events/act";
import { EventType, LiveType } from "../events/EventType";
import { EventModule } from "../events/eventModule";
import { AllCostumes } from "./costumes";
import { LivesForCostume } from "./types";

export const makeLivesForCostumes = (events: EventModule[]): LivesForCostume[] => {
  // Key は costume name
  const result: Record<string, LivesForCostume> = {};
  AllCostumes.forEach((costume) => {
    result[costume.name] = {
      costumeSlug: costume.slug,
      costumeName: costume.name,
      count: 0,
      lives: [],
      meetAndGreets: [],
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

    if (!isMeetAndGreetEvent(event)) {
      return;
    }

    collectMeetAndGreetCostumes(event).forEach((costumeName) => {
      if (!result[costumeName]) {
        return;
      }

      result[costumeName].meetAndGreets.push({
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
        acts: [],
      });
    });
  });

  return Object.values(result);
};

const isMeetAndGreetEvent = (event: EventModule): boolean => {
  return event.meta.category === EventType.EVENT && event.meta.liveType !== LiveType.RELEASE_EVENT;
};

const collectMeetAndGreetCostumes = (event: EventModule): Set<string> => {
  const result = new Set<string>();

  const add = (costumeName: string | undefined) => {
    if (costumeName == undefined) {
      return;
    }
    result.add(costumeName);
  };

  add(event.meta.costume);

  event.meta.meetAndGreet?.sessions.forEach((session) => {
    add(session.costume);
    session.lanes.forEach((lane) => {
      add(lane.costume);
    });
  });

  event.meta.acts.forEach((act) => {
    add(act.meetAndGreet?.costume);
  });

  return result;
};
