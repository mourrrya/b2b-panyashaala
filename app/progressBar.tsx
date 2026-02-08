"use client";

import { ProgressProvider } from "@bprogress/next/app";

export const ProgressBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="2px"
      color="linear-gradient(to right, #115E59, #10B981)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};
