import type {
  ChangePasswordInput,
  RequestPasswordResetInput,
  RequestPasswordResetResponse,
  ResetPasswordInput,
  SignInInput,
} from "@/types/authentication";

import type { Session } from "@/types/session";

export interface AuthenticationService {
  signIn(input: SignInInput): Promise<Session>;

  changePassword(
    input: ChangePasswordInput,
    token: string,
  ): Promise<void>;

  requestPasswordReset(
    input: RequestPasswordResetInput,
  ): Promise<RequestPasswordResetResponse>;

  resetPassword(input: ResetPasswordInput): Promise<void>;
}