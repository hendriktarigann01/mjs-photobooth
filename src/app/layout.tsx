import { Metadata } from "next";
import React, { FC, PropsWithChildren, Suspense } from "react";
import MUIThemeProvider from "@src/providers/MUIThemeProvider";
import PhotoboothProvider from "@src/contexts/PhotoboothProvider";
import TanstackQueryProvider from "@src/providers/TanstackQueryProvider";
import NotistackProvider from "@src/providers/NotistackProvider";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "MJS Photobooth",
  description: "Create lasting memories with our instant photobooth experience!",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <MUIThemeProvider>
          <TanstackQueryProvider>
            <Suspense>
              <PhotoboothProvider>
                <NotistackProvider>{children}</NotistackProvider>
              </PhotoboothProvider>
            </Suspense>
          </TanstackQueryProvider>
        </MUIThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
