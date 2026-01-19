"use client";
import React from "react";
import AuthButton from "@/components/ui/auth/AuthButton";

const Auth = () => {
  return <AuthButton showGravatar={true} gravatarSize={32} buttonSize="sm" />;
};

export default Auth;
