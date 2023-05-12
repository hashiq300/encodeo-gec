import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { RouterTransition } from "~/components/RouterTransition";
import { MantineProvider } from "@mantine/core";

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <RouterTransition />
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
