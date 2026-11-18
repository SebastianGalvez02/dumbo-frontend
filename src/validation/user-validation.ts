import type {UserContact} from "@/types/users";

export function hasUserContactChanges(changes: Partial<UserContact>,): boolean {
    return (changes.name !== undefined || changes.lastName !== undefined || changes.phone !== undefined || changes.mail !== undefined);
}