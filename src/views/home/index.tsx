"use client";

import React, { useContext, useState } from "react";
import PhotoScreen from "./screens/PhotoScreen";
import PreviewScreen from "./screens/PreviewScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import LayoutScreen from "./screens/LayoutScreen";
import {
  Box,
  CircularProgress,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Instagram, Language } from "@mui/icons-material";
import { PhotoboothContext } from "@src/contexts/PhotoboothProvider";
import QRScreen from "./screens/QRScreen";

const NativeImage = styled("img")(() => ({}));

const HomeView = () => {
  const portrait = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("xl"),
  );

  const { screen, setScreen, event } = useContext(PhotoboothContext);

  const [backgroundLoaded, setBackgroundLoaded] = useState<boolean>(false);
  const [teiLogoLoaded, setTeiLogoLoaded] = useState<boolean>(false);
  const [MJSLogoLoaded, setMJSLogoLoaded] = useState<boolean>(false);

  const imagesLoaded = backgroundLoaded && teiLogoLoaded && MJSLogoLoaded;

  const eventLogoSrc =
    event === "wmf" ? "/static/wmf.png" : "/static/archid.png";

  // const eventHashtag =
  //   event === "wmf" ? "#MJSxWeddingMarketFair" : "#MJSxARCHID2025";

  if (screen !== "welcome") {
    return (
      <>
        {!imagesLoaded && (
          <Stack
            bgcolor="Green100.main"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
          >
            <CircularProgress size="100px" sx={{ color: "Green300.main" }} />
          </Stack>
        )}

        <Box
          minHeight="100vh"
          sx={{
            position: "relative",
            display: imagesLoaded ? "block" : "none",
          }}
        >
          <NativeImage
            src={`/static/background/${
              portrait ? "bg2-potrait.webp" : "bg-landscape.webp"
            }`}
            alt="background"
            sx={{
              width: "100%",
              minHeight: "100vh",
              position: "absolute",
              zIndex: -1,
            }}
            onLoad={() => setBackgroundLoaded(true)}
          />

          <NativeImage
            src={eventLogoSrc}
            alt="tei"
            sx={{
              display: "none",
              width: "206px",
              position: "absolute",
              top: { xs: "32px", xl: "48px" },
              left: { xs: "32px", xl: "48px" },
            }}
            onLoad={() => setTeiLogoLoaded(true)}
          />

          <Typography
            position="absolute"
            top="48px"
            left="50%"
            color="white"
            fontSize="28px"
            fontWeight={500}
            sx={{ transform: "translate(-50%)" }}
          >
            {/* {eventHashtag} */}
          </Typography>

          <NativeImage
            // src="/static/mjswhite.png"
            src="/static/karindo.png"
            alt="tei"
            sx={{
              width: { xs: "230px", xl: "171px" },
              position: "absolute",
              top: { xs: "32px", xl: "48px" },
              right: { xs: "32px", xl: "48px" },
            }}
            onLoad={() => setMJSLogoLoaded(true)}
          />

          <Box width="100%" position="absolute" bottom={0}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              m={{ xs: "20px 30px", xl: "24px 40px" }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                color="white"
              >
                <Instagram sx={{ fontSize: "36px" }} />
                <Typography fontSize="22px" fontWeight="600">
                  @karindo.id
                </Typography>
              </Stack>

              <Typography fontSize="22px" color="white">
                {/* Powered By MJ Solution Indonesia */}
                Powered By Karindo
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                color="white"
              >
                <Language sx={{ fontSize: "36px" }} />
                <Typography fontSize="22px" fontWeight="600">
                  {/* mjsolution.co.id */}
                  karindoled.co.id
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {screen === "layout" && <LayoutScreen setScreen={setScreen} />}

          {screen === "photo" && <PhotoScreen />}

          {screen === "preview" && <PreviewScreen />}

          {screen === "qr" && <QRScreen />}
        </Box>
      </>
    );
  }

  return <WelcomeScreen setScreen={setScreen} />;
};

export default HomeView;
