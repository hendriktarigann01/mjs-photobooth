// Tujuan      : Menu utama navigasi (Effect, Frame, Background, Foreground) + Back/Next
// Caller      : OptionSection/index.tsx
// Dependensi  : PhotoboothContext, applyFilters helper
// Main Exports: MainMenu
import { Button, Grid2 } from "@mui/material";
import React, { Dispatch, FC, SetStateAction, useContext } from "react";
import {
  BGReplace,
  CenterFocus,
  FilterFrame,
  PhotoLib,
} from "../../../components/Icons";
import { PhotoboothContext } from "@src/contexts/PhotoboothProvider";
import { applyFilters } from "@src/helpers/applyFilters";

type Menu = {
  id?: number;
  name: string;
  icon?: JSX.Element;
  isDisabled?: boolean;
};

const menus: Menu[] = [
  { id: 1, name: "Effect", icon: <CenterFocus /> },
  { id: 2, name: "Foreground", icon: <PhotoLib />, isDisabled: true },
  { id: 3, name: "Frame", icon: <FilterFrame /> },
  {
    id: 4,
    name: "Background",
    icon: <BGReplace />,
  },
];

type MainMenuProps = {
  selectedMenu: string | null;
  setSelectedMenu: Dispatch<SetStateAction<string | null>>;
};

const MainMenu: FC<MainMenuProps> = ({ setSelectedMenu }) => {
  const {
    layout,
    photos,
    setPhotos,
    setScreen,
    selectedFilter,
    setSelectedFilter,
    setSelectedCurrentFilter,
    setSelectedFrame,
    setSelectedCurrentFrame,
    setSelectedBackground,
    setSelectedCurrentBackground,
  } = useContext(PhotoboothContext);

  const disableNextButton =
    photos.some((photo) => photo === null) || photos.length < (layout || 0);

  const onBack = () => {
    setScreen("layout");
    setPhotos([]);
    setSelectedFilter(null);
    setSelectedCurrentFilter(null);
    setSelectedFrame(null);
    setSelectedCurrentFrame(null);
    setSelectedBackground(null);
    setSelectedCurrentBackground(null);
  };

  const onNext = async () => {
    const modifiedImages = await applyFilters(photos, selectedFilter?.value);
    setPhotos(modifiedImages);
    setScreen("preview");
  };

  return (
    <Grid2 container spacing={4} width="662px">
      {menus.map((menu) => (
        <Grid2 key={menu.id} size={6}>
          <Button
            variant="contained"
            color="Green200"
            size="large"
            fullWidth
            onClick={() => setSelectedMenu(menu.name)}
            disabled={menu.isDisabled}
          >
            {Boolean(menu.icon) && menu.icon}

            {menu.name}
          </Button>
        </Grid2>
      ))}

      <Grid2 size={6}>
        <Button
          variant="contained"
          color="Green200"
          size="large"
          fullWidth
          onClick={onBack}
        >
          Back
        </Button>
      </Grid2>

      <Grid2 size={6}>
        <Button
          variant="contained"
          color="Green200"
          size="large"
          fullWidth
          disabled={disableNextButton}
          onClick={onNext}
        >
          Next
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default MainMenu;
