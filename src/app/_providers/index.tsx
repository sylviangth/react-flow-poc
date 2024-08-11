"use client";

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from 'next/navigation'
import { ToastContainer } from 'react-toastify';
import { TrpcProvider } from '~/utils/trpc-provider';

export function Providers({ children }: { children: React.ReactNode }) {

  const router = useRouter();

  return (
    <NextUIProvider navigate={(path) => router.push(path)}>
      <NextThemesProvider attribute="class" defaultTheme="mindpal-light">
        <ToastContainer
          theme="light" position="top-center"
          autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover
        />
        <TrpcProvider>
          {children}
        </TrpcProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}