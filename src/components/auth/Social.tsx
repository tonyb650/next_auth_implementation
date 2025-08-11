"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

const Social = () => {
  return (
    <div className="flex items-center w-full gap-x-2 ">
      <Button
        size="lg"
        className="flex-auto"
        variant={"outline"}
        onClick={() => {}}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size="lg"
        className="flex-auto"
        variant={"outline"}
        onClick={() => {}}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Social;
