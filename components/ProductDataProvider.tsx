"use client";

import { useStore } from "@/lib/store";
import { useEffect } from "react";

export function ProductDataProvider() {
  const { initialize } = useStore();

  useEffect(() => {
    initialize();
  }, []);

  return null; // This component doesn't render anything
}
