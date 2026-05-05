import {
  Box,
  Button,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { PhotoboothContext } from "@src/contexts/PhotoboothProvider";
import { backgrounds, BackgroundOption } from "@src/static/background-list";
import React, {
  Dispatch,
  FC,
  MouseEventHandler,
  SetStateAction,
  useContext,
} from "react";

// Types

type BackgroundMenuProps = {
  selectedMenu: string | null;
  setSelectedMenu: Dispatch<SetStateAction<string | null>>;
};

type PreviewProps = {
  selected: boolean;
  bg: BackgroundOption | null;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

// Sub-component: Preview thumbnail

const Preview: FC<PreviewProps> = ({ selected, bg, onClick }) => {
  return (
    <Stack
      onClick={onClick}
      alignItems="center"
      justifyContent="center"
      sx={{
        bgcolor: "Neutral600.main",
        minWidth: "162px",
        height: "246px",
        outline: selected ? "1px solid white" : "none",
        outlineOffset: "4px",
        position: "relative",
        backgroundImage: bg ? `url(${bg.thumbnail})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: "pointer",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      {bg === null && (
        <Typography fontSize="24px" color="white">
          None
        </Typography>
      )}
    </Stack>
  );
};

// Main Component

const BackgroundMenu: FC<BackgroundMenuProps> = ({ setSelectedMenu }) => {
  const portrait = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("xl"),
  );

  const {
    selectedCurrentBackground,
    setSelectedBackground,
    setSelectedCurrentBackground,
  } = useContext(PhotoboothContext);

  // Opsi "None" ditambahkan di awal daftar
  const allOptions: (BackgroundOption | null)[] = [null, ...backgrounds];

  return (
    <Box width={{ xs: "662px", xl: "570px" }}>
      {/* Desktop: grid vertikal scrollable */}
      {!portrait && (
        <Box
          display="grid"
          gridTemplateColumns="repeat(3, 1fr)"
          gap="38px"
          height="450px"
          m="-4px"
          p="8px"
          sx={{
            overflowY: "scroll",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {allOptions.map((bg, index) => {
            const selected =
              bg === null
                ? selectedCurrentBackground === null
                : selectedCurrentBackground === bg.url;

            return (
              <Preview
                key={bg?.id ?? "none"}
                selected={selected}
                bg={bg}
                onClick={() => setSelectedCurrentBackground(bg?.url ?? null)}
              />
            );
          })}
        </Box>
      )}

      {/* Portrait: horizontal scroll */}
      {portrait && (
        <Stack
          direction="row"
          spacing={5}
          sx={{
            overflowX: "scroll",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
          m="-4px"
          p={1}
        >
          {allOptions.map((bg) => {
            const selected =
              bg === null
                ? selectedCurrentBackground === null
                : selectedCurrentBackground === bg.url;

            return (
              <Preview
                key={bg?.id ?? "none"}
                selected={selected}
                bg={bg}
                onClick={() => setSelectedCurrentBackground(bg?.url ?? null)}
              />
            );
          })}
        </Stack>
      )}

      {/* Tombol Cancel & Apply */}
      <Stack direction="row" spacing="38px" mt="38px">
        <Button
          variant="contained"
          color="Green200"
          size="large"
          fullWidth
          onClick={() => {
            setSelectedMenu(null);
            setSelectedCurrentBackground(null);
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="Green200"
          size="large"
          fullWidth
          onClick={() => {
            setSelectedBackground(selectedCurrentBackground);
            setSelectedMenu(null);
          }}
        >
          Apply
        </Button>
      </Stack>
    </Box>
  );
};

export default BackgroundMenu;
