export interface SignInInput {
    mail: string;
    password: string;
}
export interface changePasswordInput {
    oldPassword: string;
    newPassword: string;
}
export interface RequestPasswordResetInput {
    mail: string;
}
export interface RequestPasswordResetResponse {
    message: string;
}
export interface ResetPasswordInput {
    mail: string;
    token: string;
    newPassword: string;
}