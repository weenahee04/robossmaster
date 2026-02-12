import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      branchId: string | null;
      branchSlug: string | null;
      branchName: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    branchId: string | null;
    branchSlug: string | null;
    branchName: string | null;
  }
}
