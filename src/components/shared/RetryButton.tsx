"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function RetryButton() {
  return (
    <Button onClick={() => window.location.reload()} aria-label="Retry loading stories">
      Retry
    </Button>
  );
}
