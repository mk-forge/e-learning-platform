export type Course = {
    id: number;
    title: string;
    description: string;
    teacherId: number;
    createdAt: Date;
    teacher: User;
};

export type User = {
    id: number;
    firstName: string;
    lastName: string;
};