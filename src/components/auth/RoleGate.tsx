import { UserRole } from "@/generated/prisma";
import useCurrentRole from "@/hooks/useCurrentRole";
import { PropsWithChildren } from "react";
import FormError from "../FormError";

type RoleGateProps = {
  allowedRole: UserRole;
};

const RoleGate = ({
  children,
  allowedRole
}: PropsWithChildren<RoleGateProps>) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content." />
    );
  }
  return <>{children}</>;
};

export default RoleGate;
