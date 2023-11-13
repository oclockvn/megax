"use client";

import React from "react";
import { ConfirmProvider } from "material-ui-confirm";
import { Toaster } from "react-hot-toast";
import useScrollDirection from "@/hooks/useScroll";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dir = useScrollDirection();

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <ConfirmProvider defaultOptions={{}}>
        <Toaster />
        {children}

        {dir === "down" && (
          <IconButton
            color="primary"
            className="fixed bottom-[50px] right-[25px] z-100 bg-blue-200"
            type="button"
            onClick={scrollTop}
          >
            <ArrowUpwardIcon />
          </IconButton>
        )}
      </ConfirmProvider>
    </>
  );
}
