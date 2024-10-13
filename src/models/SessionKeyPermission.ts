export type SessionKeyPermission = {
    isValid: boolean;
    approvedTargets: string[];
    label: string[];
    labelNotAuthorized: string[];
};