"use client";

import { useProductStore } from "@/store/store";
import { useEffect } from "react";

export function ProductDataProvider() {
  const { initialize } = useProductStore();

  useEffect(() => {
    initialize();
  }, []);

  return null; // This component doesn't render anything
}
