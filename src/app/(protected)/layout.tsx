import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Navbar from "./_components/Navbar";

const ProtectedLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-radial-[at_50%_00%] from-sky-400 to-blue-800">
        <Navbar/>
        {children}
      </div>
    </SessionProvider>
  );
}

export default ProtectedLayout