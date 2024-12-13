export type TUpdateUserProfileInput = {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    dateOfBirth?: string; // Assuming date will be provided in ISO format
    gender?: string;
    studentCategory?: string;
    universityAttended?: string;
    yearOfGraduation?: string;
    nigeriaLawSchoolCurrentlyAt?: string;
    level?: string;
    businessName?: string;
    businessDescription?: string;
    businessEmail?: string;
    businessSector?: string;
    businessAddress?: string;
    emailNotification?: boolean;
    textNotification?: boolean;
    description?: string;
    keywords?: string;
    lawServices?: string;
};
