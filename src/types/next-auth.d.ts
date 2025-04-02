import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id?: string;
            email?: string | null;
            photoUrl?: string | null;
            firstName?: string;
            lastName?: string;
            role?: string;
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
    }
}