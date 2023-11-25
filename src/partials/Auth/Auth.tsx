'use client';
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const { user, login, signup, logout } = useAuth();

  return (
    <div>
      {user ? (
        <div>
          <img
            src={user.user_metadata?.avatar_url}
            alt="User Avatar"
            className="rounded-circle"
          />
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={login}>Login</button>
          <button onClick={signup}>Sign up</button>
        </div>
      )}
    </div>
  );
};

export default Auth;
