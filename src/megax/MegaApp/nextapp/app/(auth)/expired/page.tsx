"use client";

// import Typography from "@mui/material/Typography";
import { useEffect } from "react";

// import { signOut } from "next-auth/react";

export default function ExpiryPage() {
  useEffect(() => {
    // const t = setTimeout(signOut, 2000);
    // return () => {
    //   clearTimeout(t);
    // };
  }, []);

  return (
    <div className="py-8">
      <h3>
        Your session had been expired! Please re-login to use application.
        <br />
        Redirecting...
      </h3>
    </div>
  );
}
