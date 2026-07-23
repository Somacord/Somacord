export interface PartnerInquiryActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

export const initialPartnerInquiryActionState: PartnerInquiryActionState = { status: "idle" };
