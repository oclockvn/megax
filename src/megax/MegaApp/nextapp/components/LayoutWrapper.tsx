"use client";

import React from "react";
import { ConfirmProvider } from "material-ui-confirm";
import { Toaster } from "react-hot-toast";
import NoSSR from "./NoSSR";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NoSSR>
        <ConfirmProvider defaultOptions={{}}>
          <Toaster />
          {children}
        </ConfirmProvider>
      </NoSSR>
    </>
  );
}
