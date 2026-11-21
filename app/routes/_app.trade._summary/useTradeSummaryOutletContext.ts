import { useOutletContext } from "react-router";
import { MemberDescription } from "~/features/profile/types.ts";

export interface TradeSummaryOutletContext {
  selectedMember: MemberDescription | undefined;
}

export const useTradeSummaryOutletContext = () => useOutletContext<TradeSummaryOutletContext>();
