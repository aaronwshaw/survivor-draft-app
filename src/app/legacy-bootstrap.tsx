"use client";

import { useEffect } from "react";

export default function LegacyBootstrap() {
  useEffect(() => {
    void import("./legacy-app.js");
  }, []);

  return null;
}
