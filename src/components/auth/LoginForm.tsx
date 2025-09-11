"use client"

import React, { useState, useTransition } from "react";
import CardWrapper from "@/components/auth/CardWrapper";
import { LoginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider" : undefined

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setSuccess(undefined)
    setError(undefined)
    startTransition(async () => {
      const data = await login(values)
      setError(data.error)
      setSuccess(data.success)
    })
  }

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} placeholder="john.doe@example.com" type={"email"}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} placeholder="********" type="password"/>
                  </FormControl>
                  {/* "use 'asChild' so the button properly uses the link inside */}
                  <Button size="sm" asChild variant='link' className="px-0 font-normal"> 
                    <Link href="/auth/reset">
                      Forgot Password?
                    </Link>
                  </Button>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || urlError}/>
          <FormSuccess message={success}/>
          <Button disabled={isPending} type="submit" className="w-full">
              Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
