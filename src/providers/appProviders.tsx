"use client";

import ReduxProvider from "./reduxProvider";
import QueryProvider from "./queryProvider";
import ToastProvider from "./toastProvider";
import SessionHydrator from "@/components/auth/sessionHydrator";

type Props = {
  children: React.ReactNode;
};

export default function AppProviders({ children }: Props) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <SessionHydrator />
        {children}
        <ToastProvider />
      </QueryProvider>
    </ReduxProvider>
  );
}
