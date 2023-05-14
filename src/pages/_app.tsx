import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { RouterTransition } from "~/components/RouterTransition";
import { MantineProvider } from "@mantine/core";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
    <ClerkProvider {...pageProps}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <RouterTransition />
        <Component {...pageProps} />
      </MantineProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
