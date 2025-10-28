"use client";
import { ReactLenis } from "lenis/react";
import { PropsWithChildren } from "react";

export default function SmoothScroll({ children }: PropsWithChildren) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 3, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
