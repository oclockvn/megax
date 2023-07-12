"use client";

import React from "react";
import { ConfirmProvider } from "material-ui-confirm";
import { Toaster } from "react-hot-toast";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <ConfirmProvider defaultOptions={{}}>
        <Toaster />
        {children}
      </ConfirmProvider>
    </>
  );
}
