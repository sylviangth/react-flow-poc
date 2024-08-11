"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeWrapper(props: { themeValue?: string, children: React.ReactNode }) {

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (props.themeValue && theme !== props.themeValue) {
      setTheme(props.themeValue);
    }
  }, [])

  return (
    <main className={props.themeValue}>
      {props.children}
    </main>
  )
}