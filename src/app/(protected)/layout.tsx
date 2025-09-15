import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const ProtectedLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}

export default ProtectedLayout