export interface GatheringActionState {
  status: "idle" | "error";
  message?: string;
}

export const initialGatheringActionState: GatheringActionState = { status: "idle" };
