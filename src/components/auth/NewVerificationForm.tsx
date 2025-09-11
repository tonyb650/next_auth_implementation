"use client";

import React, { useCallback, useEffect, useState } from "react";
import CardWrapper from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";


const NewVerificationForm = () => {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token")
      return
    }
    newVerification(token)
      .then(data => {
        setSuccess(data.success)
        setError(data.error)
      })
      .catch(() => {
        setError("Something went wrong.")
      })
  },[token])

  useEffect(() => {
    onSubmit()
  },[onSubmit])

  console.log(searchParams)
  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        { !error && !success &&
          <BeatLoader  />
        }
      </div>
      <FormError message={error}/>
      <FormSuccess message={success}/>
    </CardWrapper>
  );
};

export default NewVerificationForm;
