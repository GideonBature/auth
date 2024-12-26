export type TUpdateUserProfileInput = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    dateOfBirth?: string; // Assuming date will be provided in ISO format
    gender?: string;
    emailNotification?: boolean;
    textNotification?: boolean;
};
