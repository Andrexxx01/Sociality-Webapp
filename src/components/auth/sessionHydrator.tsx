"use client";

import { useEffect } from "react";
import { getAuthSession } from "@/lib/auth-token";
import { setCredentials, setHydrated } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";

export default function SessionHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const session = getAuthSession();
    if (session) {
      dispatch(setCredentials(session));
    }
    dispatch(setHydrated(true));
  }, [dispatch]);

  return null;
}
