import LoginButton from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";


const poppins =  Poppins({
  subsets: ["latin"],
  weight: ["600"],
})

console.log(poppins.className)
export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-radial-[at_50%_00%] from-sky-400 to-blue-800">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-white text-6xl drop-shadow-md", poppins.className)}>
          🔒 Auth
        </h1>
        <p className="text-white text-lg">
          A simple authentication service
        </p>
        <LoginButton mode="redirect">
          <Button variant={"secondary"} size={"lg"}>Sign In</Button>
        </LoginButton>
      </div>
    </main>
  );
}
