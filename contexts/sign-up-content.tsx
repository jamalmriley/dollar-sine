"use client";

import { Role } from "@/types/user";
import { createContext, useContext, useState } from "react";

type SignUpContext = {
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  emailAddress: string;
  setEmailAddress: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  pendingVerification: boolean;
  setPendingVerification: React.Dispatch<React.SetStateAction<boolean>>;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  role: Role;
  setRole: React.Dispatch<React.SetStateAction<Role>>;
  relation: string;
  setRelation: React.Dispatch<React.SetStateAction<string>>;
  isTermsAccepted: boolean;
  setIsTermsAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
};

export const SignUpContext = createContext<SignUpContext | null>(null);

export default function SignUpContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pendingVerification, setPendingVerification] =
    useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [role, setRole] = useState<Role>(null);
  const [relation, setRelation] = useState<string>("");
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);

  return (
    <SignUpContext.Provider
      value={{
        firstName,
        setFirstName,
        lastName,
        setLastName,
        emailAddress,
        setEmailAddress,
        password,
        setPassword,
        pendingVerification,
        setPendingVerification,
        code,
        setCode,
        error,
        setError,
        role,
        setRole,
        relation,
        setRelation,
        isTermsAccepted,
        setIsTermsAccepted,
        seconds,
        setSeconds,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
}

export function useSignUpContext() {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error(
      "useSignUpContext must be used within a SignUpContextProvider."
    );
  }
  return context;
}
