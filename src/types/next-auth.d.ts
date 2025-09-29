import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      phone?: string | null;
      name?: string | null;
      image?: string | null;
      role: "patient" | "doctor";
      ayursutraId?: string | null;
      doctorInfo?: {
        id: number;
        hprId?: string | null;
        abhaId?: string | null;
        specialization?: string | null;
        experience?: string | null;
        location?: string | null;
        rating?: string | null;
        isVerified: boolean;
      };
    };
  }

  interface User {
    id: string;
    email?: string | null;
    phone?: string | null;
    role: "patient" | "doctor";
    ayursutraId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "patient" | "doctor";
    phone?: string | null;
    ayursutraId?: string | null;
    doctorInfo?: any;
  }
}
