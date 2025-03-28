export interface Course {
    id: number;
    title: string;
    description?: string | null;
    capacity?: number | null;
    isPremium: boolean;
    hasAds: boolean;
    teacherId: number;
    createdAt: Date | string;
    teacher: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    materials?: any[];
    assignments?: any[];
}

export type User = {
    id: number;
    firstName: string;
    lastName: string;
};