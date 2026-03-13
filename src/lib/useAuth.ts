"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "admin-password";

export function useAuth() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [checking, setChecking] = useState(true);

  const validate = useCallback(async (pw: string) => {
    try {
      const res = await fetch("/api/photos/auth", {
        method: "POST",
        headers: { "x-upload-password": pw },
      });
      if (res.ok) {
        setPassword(pw);
        setAuthenticated(true);
        localStorage.setItem(STORAGE_KEY, pw);
        return true;
      }
    } catch {}
    return false;
  }, []);

  // On mount, check localStorage for a saved password
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      validate(saved).finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [validate]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError("");
      if (!password.trim()) return;
      const ok = await validate(password);
      if (!ok) {
        setLoginError("Wrong password");
      }
    },
    [password, validate],
  );

  return {
    password,
    setPassword,
    authenticated,
    loginError,
    handleLogin,
    checking,
  };
}
