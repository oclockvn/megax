import dynamic from "next/dynamic";
import React from "react";

const NoSSRWrapper = ({ children }: { children: React.ReactNode }) => (
  <React.Fragment>{children}</React.Fragment>
);

export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
