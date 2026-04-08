import {
  Box,
  Button,
  Grid2,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { PhotoboothContext } from "@src/contexts/PhotoboothProvider";
import { frame } from "@src/static/frame-list";
import React, {
  Dispatch,
  FC,
  MouseEventHandler,
  SetStateAction,
  useContext,
} from "react";

type FrameMenuProps = {
  selectedMenu: string | null;
  setSelectedMenu: Dispatch<SetStateAction<string | null>>;
};

type PreviewProps = {
  selected: boolean;
  frame: string | null;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const Preview: FC<PreviewProps> = ({ selected, frame, onClick }) => {
  const smallFrameFilename = frame?.split(".")[0].concat("-small.png");

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
        backgroundImage: frame
          ? `url(${"/static/frames/".concat(smallFrameFilename || "")})`
          : "none",
        backgroundSize: "cover",
      }}
    >
      {frame === null && <Typography fontSize="24px">None</Typography>}
    </Stack>
  );
};

const FrameMenu: FC<FrameMenuProps> = ({ setSelectedMenu }) => {
  const portrait = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("xl"),
  );

  const {
    event,
    layout,
    selectedCurrentFrame,
    setSelectedFrame,
    setSelectedCurrentFrame,
  } = useContext(PhotoboothContext);

  const frames = frame["flei"][(layout as number) || 1] || [];

  return (
    <Box width={{ xs: "662px", xl: "570px" }}>
      {!portrait && (
        <Grid2
          container
          spacing="38px"
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
          {frames.map((frame, index) => {
            const selected = frame === selectedCurrentFrame;

            return (
              <Grid2 key={index} size={4} display="flex">
                <Preview
                  selected={selected}
                  frame={frame}
                  onClick={() => setSelectedCurrentFrame(frame)}
                />
              </Grid2>
            );
          })}
        </Grid2>
      )}

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
          {frames.map((frame) => {
            const selected = frame === selectedCurrentFrame;

            return (
              <Preview
                key={frame}
                selected={selected}
                frame={frame}
                onClick={() => setSelectedCurrentFrame(frame)}
              />
            );
          })}
        </Stack>
      )}

      <Stack direction="row" spacing="38px" mt="38px">
        <Button
          variant="contained"
          color="Green200"
          size="large"
          fullWidth
          onClick={() => {
            setSelectedMenu(null);
            setSelectedCurrentFrame(null);
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
            setSelectedFrame(selectedCurrentFrame);
            setSelectedMenu(null);
          }}
        >
          Apply
        </Button>
      </Stack>
    </Box>
  );
};

export default FrameMenu;
