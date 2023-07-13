import dynamic from "next/dynamic";
import React from "react";

const LazyLoadingWrapper = ({ children }: { children: React.ReactNode }) => (
  <React.Fragment>{children}</React.Fragment>
);

export default dynamic(() => Promise.resolve(LazyLoadingWrapper), {
  ssr: false,
});

export const withDynamic = (Component: React.ComponentType) => {
  return () => {
    return (
      <LazyLoadingWrapper>
        <Component />
      </LazyLoadingWrapper>
    );
  };
};
