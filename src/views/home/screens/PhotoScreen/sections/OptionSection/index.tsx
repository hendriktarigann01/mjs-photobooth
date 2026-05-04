// Tujuan      : Panel opsi kustom (Effect, Frame, Background) di layar foto
// Caller      : PhotoScreen/index.tsx
// Dependensi  : PhotoboothContext
// Main Exports: OptionSection
import { Box, Typography } from "@mui/material";
import React, { useContext } from "react";

import MainMenu from "./components/MainMenu";
import EffectMenu from "./components/EffectMenu";
import { PhotoboothContext } from "@src/contexts/PhotoboothProvider";
import FrameMenu from "./components/FrameMenu";
import BackgroundMenu from "./components/BackgroundMenu";

const OptionSection = () => {
  const { selectedMenu, setSelectedMenu } = useContext(PhotoboothContext);

  return (
    <Box>
      <Typography
        textAlign="center"
        mb={{ xs: "36px", xl: 6 }}
        fontSize="40px"
        fontWeight={600}
        color="white"
      >
        {selectedMenu || "Strike a pose, freeze the moment!"}
      </Typography>

      <Box flexGrow={1} display="flex" justifyContent="center">
        {!selectedMenu && (
          <MainMenu
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        )}

        {selectedMenu === "Effect" && (
          <EffectMenu
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        )}

        {selectedMenu === "Frame" && (
          <FrameMenu
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        )}

        {selectedMenu === "Background" && (
          <BackgroundMenu
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        )}
      </Box>
    </Box>
  );
};

export default OptionSection;
