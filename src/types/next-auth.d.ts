

declare module "next-auth" {
    interface User {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        photoUrl?: string;  // Add photoUrl field here
    }

    interface Session {
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            name: string;
            role: string;
            photoUrl?: string;  // Add photoUrl field here
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        firstName: string;
        lastName: string;
        role: string;
        photoUrl?: string;  // Add photoUrl field here
    }
}