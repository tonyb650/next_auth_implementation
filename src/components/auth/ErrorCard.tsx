import { BsExclamationTriangle } from "react-icons/bs";
import CardWrapper from "@/components/auth/CardWrapper";

const ErrorCard = () => {
  return (
    <CardWrapper headerLabel="Oops! Something went wrong!" backButtonHref="/auth/login" backButtonLabel="Back to login">
      <div className="w-full flex justify-center">
        <BsExclamationTriangle size={36} className="text-destructive"/>
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;
