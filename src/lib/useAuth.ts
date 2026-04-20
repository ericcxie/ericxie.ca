"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "admin-password";
const FAIL_COUNT_KEY = "admin-fail-count";
const LOCKOUT_KEY = "admin-lockout-until";
const MAX_ATTEMPTS = 3;
const COOLDOWN_MS = 8760 * 60 * 60 * 1000; // 8760 hours in ms

export function useAuth() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [checking, setChecking] = useState(true);
  const [lockedOut, setLockedOut] = useState(false);

  const checkLockout = useCallback(() => {
    const until = localStorage.getItem(LOCKOUT_KEY);
    if (until && Date.now() < Number(until)) {
      setLockedOut(true);
      return true;
    }
    if (until) {
      localStorage.removeItem(LOCKOUT_KEY);
      localStorage.removeItem(FAIL_COUNT_KEY);
      setLockedOut(false);
    }
    return false;
  }, []);

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
        localStorage.removeItem(FAIL_COUNT_KEY);
        localStorage.removeItem(LOCKOUT_KEY);
        return true;
      }
    } catch {}
    return false;
  }, []);

  // On mount, check localStorage for a saved password
  useEffect(() => {
    checkLockout();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      validate(saved).finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [validate, checkLockout]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError("");
      if (!password.trim()) return;
      if (checkLockout()) return;
      const ok = await validate(password);
      if (!ok) {
        const fails = Number(localStorage.getItem(FAIL_COUNT_KEY) ?? "0") + 1;
        if (fails >= MAX_ATTEMPTS) {
          localStorage.setItem(LOCKOUT_KEY, String(Date.now() + COOLDOWN_MS));
          localStorage.removeItem(FAIL_COUNT_KEY);
          setLockedOut(true);
        } else {
          localStorage.setItem(FAIL_COUNT_KEY, String(fails));
          const remaining = MAX_ATTEMPTS - fails;
          setLoginError(`Wrong password — ${remaining} attempt${remaining === 1 ? "" : "s"} remaining`);
        }
      }
    },
    [password, validate, checkLockout],
  );

  return {
    password,
    setPassword,
    authenticated,
    loginError,
    handleLogin,
    checking,
    lockedOut,
  };
}
