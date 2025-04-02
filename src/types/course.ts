export interface Course {
    id: number;
    title: string;
    description?: string | null;
    capacity?: number | null;
    isPremium: boolean;
    photoUrl?: string | null;
    hasAds: boolean;
    teacherId: number;
    createdAt: Date | string;
    teacher: {
        firstName: string; lastName: string; id: number
    };
    materials?: any[];
    assignments?: any[];
}

export type User = {
    id: number;
    firstName: string;
    lastName: string;
};