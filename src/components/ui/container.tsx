import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div">;

export function Container({ className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12 xl:px-16 ${className}`}
      {...props}
    />
  );
}
