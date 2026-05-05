"use client";

import { useSearchParams } from "next/navigation";
import React, {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";

// Types

export type PhotoFilter = { id: number; name: string; value: string };

type ImageVariant = {
  feed: string | null;
  story: string | null;
  normal: string | null;
};

type PhotoboothContextType = {
  event: string | null;

  layout: NumberOfLayout | null;
  setLayout: Dispatch<SetStateAction<NumberOfLayout | null>>;

  photos: (string | null)[];
  setPhotos: Dispatch<SetStateAction<(string | null)[]>>;

  selectedFilter: PhotoFilter | null;
  setSelectedFilter: Dispatch<SetStateAction<PhotoFilter | null>>;
  selectedCurrentFilter: PhotoFilter | null;
  setSelectedCurrentFilter: Dispatch<SetStateAction<PhotoFilter | null>>;

  screen: Screen;
  setScreen: Dispatch<SetStateAction<Screen>>;

  selectedMenu: string | null;
  setSelectedMenu: Dispatch<SetStateAction<string | null>>;

  selectedFrame: string | null;
  setSelectedFrame: Dispatch<SetStateAction<string | null>>;
  selectedCurrentFrame: string | null;
  setSelectedCurrentFrame: Dispatch<SetStateAction<string | null>>;

  selectedBackground: string | null;
  setSelectedBackground: Dispatch<SetStateAction<string | null>>;
  selectedCurrentBackground: string | null;
  setSelectedCurrentBackground: Dispatch<SetStateAction<string | null>>;

  photoResult: string | null;
  setPhotoResult: Dispatch<SetStateAction<string | null>>;

  imageVariant: ImageVariant;
  setImageVariant: Dispatch<SetStateAction<ImageVariant>>;
};

export type NumberOfLayout = 1 | 2 | 4;

export type Screen = "welcome" | "layout" | "photo" | "preview" | "qr";

// Components

export const PhotoboothContext = createContext<PhotoboothContextType>({
  event: null,

  layout: null,
  setLayout: () => {},

  photos: [],
  setPhotos: () => {},

  selectedFilter: null,
  setSelectedFilter: () => {},
  selectedCurrentFilter: null,
  setSelectedCurrentFilter: () => {},

  screen: "welcome",
  setScreen: () => {},

  selectedMenu: null,
  setSelectedMenu: () => {},

  selectedFrame: null,
  setSelectedFrame: () => {},
  selectedCurrentFrame: null,
  setSelectedCurrentFrame: () => {},

  selectedBackground: null,
  setSelectedBackground: () => {},
  selectedCurrentBackground: null,
  setSelectedCurrentBackground: () => {},

  photoResult: null,
  setPhotoResult: () => {},

  imageVariant: { feed: null, story: null, normal: null },
  setImageVariant: () => {},
});

// Main Component

const PhotoboothProvider: FC<PropsWithChildren> = ({ children }) => {
  const searchParams = useSearchParams();
  const event = searchParams.get("event");

  const [screen, setScreen] = useState<Screen>("welcome");
  const [layout, setLayout] = useState<NumberOfLayout | null>(null);
  const [photos, setPhotos] = useState<(string | null)[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter | null>(
    null
  );
  const [selectedCurrentFilter, setSelectedCurrentFilter] =
    useState<PhotoFilter | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [selectedCurrentFrame, setSelectedCurrentFrame] = useState<
    string | null
  >(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(
    null
  );
  const [selectedCurrentBackground, setSelectedCurrentBackground] = useState<
    string | null
  >(null);
  const [photoResult, setPhotoResult] = useState<string | null>(null);
  const [imageVariant, setImageVariant] = useState<ImageVariant>({
    feed: null,
    story: null,
    normal: null,
  });

  return (
    <PhotoboothContext.Provider
      value={{
        event,
        layout,
        setLayout,
        photos,
        setPhotos,
        selectedFilter,
        setSelectedFilter,
        screen,
        setScreen,
        selectedCurrentFilter,
        setSelectedCurrentFilter,
        selectedMenu,
        setSelectedMenu,
        selectedFrame,
        setSelectedFrame,
        selectedCurrentFrame,
        setSelectedCurrentFrame,
        selectedBackground,
        setSelectedBackground,
        selectedCurrentBackground,
        setSelectedCurrentBackground,
        photoResult,
        setPhotoResult,
        imageVariant,
        setImageVariant,
      }}
    >
      {children}
    </PhotoboothContext.Provider>
  );
};

export default PhotoboothProvider;
