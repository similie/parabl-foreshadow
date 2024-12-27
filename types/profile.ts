import { type User } from "./context";

export type OTPValidation = {
  otp: boolean;
  user: User | null;
  token?: string;
};
