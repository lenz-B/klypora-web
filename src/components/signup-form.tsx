"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";

const TITLE = 'Klypora'

export function SignupForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  return (
    
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-bg border p-4 md:rounded-2xl md:p-8">
      <h2 className="text-heading-lg flex-center">
        Welcome to {TITLE}
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Durden" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="example@gmail.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>

        <motion.button
          whileHover={{ scale: 0.99 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="group/btn relative block h-10 w-full rounded-xl 
            bg-gradient-to-br from-accent to-accent-dark font-medium 
            text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]
            "
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </motion.button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">
          <motion.button
            whileHover={{ scale: 0.99 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="group/btn shadow-input bg-gradient-to-br from-accent/2 to-zinc-900 relative flex h-10 w-full flex-center space-x-2 rounded-xl border"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-gray-50 " />
            <span className="text-sm text-gray-50 font-medium ">
              Log in with Google
            </span>
            <BottomGradient />
          </motion.button>
        </div>

        <div className="flex-center">
          <p className="text-caption text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-gray-200 hover:text-white text-caption">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
