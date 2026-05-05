"use client";

import { CameraAltOutlined } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  PhotoboothContext,
  PhotoFilter,
} from "@src/contexts/PhotoboothProvider";
import Image from "next/image";
import React, {
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import { useVirtualBackground } from "@src/hooks/useVirtualBackground";

// Types

type CameraProps = {
  cameraHeight: number;
  index: number;
  photos: (string | null)[];
  setPhotos: Dispatch<SetStateAction<(string | null)[]>>;
  latestCameraIndex: number;
  setLatestCameraIndex: Dispatch<SetStateAction<number>>;
  retakeCameraIndex: number | null;
  setRetakeCameraIndex: Dispatch<SetStateAction<number | null>>;
};

type CameraViewProps = {
  photo: string | null;
  isTimerOn: boolean;
  timeLeft: number;
  startCaptureTimer: (index: number) => void;
  handleRetake: (index: number) => void;
  index: number;
  latestCameraIndex: number;
  retakeCameraIndex: number | null;
  cameraWidth: number;
  cameraHeight: number;
  webcamRef: RefObject<Webcam>;
  canvasRef: RefObject<HTMLCanvasElement>;
  selectedFilter: PhotoFilter | null;
  selectedMenu: string | null;
  hasVirtualBg: boolean;
};

// Components

const CameraIconWrapper = styled(Stack)(({ theme }) => ({
  position: "absolute",
  zIndex: 5,
  padding: "24px",
  backgroundColor: theme.palette.Green200.main,
  borderRadius: "100%",
  bottom: "20px",
  left: "50%",
  transform: "translate(-50%)",
  cursor: "pointer",
}));

const LoaderWrapper = styled(Box)(() => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 3,
}));

const TimeLeftText = styled(Typography)(() => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
}));

const SpinnerWrapper = styled(Box)(() => ({
  position: "relative",
  width: "180px",
  height: "180px",

  "@keyframes loader": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(-360deg)",
    },
  },

  animation: "loader 1s linear infinite",
}));

const RetakeButton = styled(Button)(() => ({
  position: "absolute",
  zIndex: 5,
  bottom: "20px",
  right: "20px",
}));

// Helper Components

const CameraView: FC<CameraViewProps> = ({
  photo,
  isTimerOn,
  timeLeft,
  startCaptureTimer,
  handleRetake,
  index,
  // latestCameraIndex,
  retakeCameraIndex,
  cameraWidth,
  cameraHeight,
  webcamRef,
  canvasRef,
  selectedFilter,
  selectedMenu,
  hasVirtualBg,
}) => {
  const showCaptureButton =
    !selectedMenu &&
    !isTimerOn &&
    !photo &&
    (retakeCameraIndex === index || retakeCameraIndex === null);
  const showLoader = isTimerOn;
  const showRetakeButton = photo && retakeCameraIndex === null;
  const showPhoto = photo;
  const showWebcam =
    !photo && (retakeCameraIndex === index || retakeCameraIndex === null);

  return (
    <>
      {showCaptureButton && (
        <CameraIconWrapper onClick={() => startCaptureTimer(index)}>
          <CameraAltOutlined sx={{ fontSize: "54px", color: "white" }} />
        </CameraIconWrapper>
      )}

      {showLoader && (
        <LoaderWrapper>
          <TimeLeftText typography="Heading1" color="white">
            {Boolean(timeLeft) && timeLeft}
          </TimeLeftText>

          <SpinnerWrapper>
            <Image src="/static/icon/loader.png" alt="loader" fill />
          </SpinnerWrapper>
        </LoaderWrapper>
      )}

      {showRetakeButton && (
        <RetakeButton
          color="Green100"
          size="large"
          onClick={() => handleRetake(index)}
        >
          Retake
        </RetakeButton>
      )}

      {showPhoto && (
        <Image
          src={photo}
          alt="photo"
          fill
          style={{ filter: selectedFilter?.value || "none" }}
        />
      )}

      {showWebcam && (
        <>
          <Webcam
            screenshotQuality={100}
            ref={webcamRef}
            audio={false}
            mirrored
            width={cameraWidth}
            height={cameraHeight}
            videoConstraints={{ width: cameraWidth, height: cameraHeight }}
            screenshotFormat="image/jpeg"
            style={{
              filter: selectedFilter?.value,
              // Sembunyikan video mentah saat virtual bg aktif
              opacity: hasVirtualBg ? 0 : 1,
              position: hasVirtualBg ? "absolute" : "static",
            }}
          />
          {/* Canvas overlay untuk virtual background rendering */}
          <canvas
            ref={canvasRef as RefObject<HTMLCanvasElement>}
            width={cameraWidth}
            height={cameraHeight}
            style={{
              display: hasVirtualBg ? "block" : "none",
              filter: selectedFilter?.value || "none",
              width: "100%",
              height: "100%",
              transform: "scaleX(-1)", // mirror sama seperti webcam
            }}
          />
        </>
      )}
    </>
  );
};

// Main Component

const Camera: FC<CameraProps> = ({
  index,
  cameraHeight,
  photos,
  setPhotos,
  latestCameraIndex,
  setLatestCameraIndex,
  retakeCameraIndex,
  setRetakeCameraIndex,
}) => {
  const {
    selectedFilter,
    selectedCurrentFilter,
    selectedMenu,
    selectedBackground,
    selectedCurrentBackground,
  } = useContext(PhotoboothContext);

  const webcamRef = useRef<Webcam>(null);
  const cameraWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cameraWrapperWidth, setCameraWrapperWidth] = useState<number>(0);
  const [isTimerOn, setIsTimerOn] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(3); // In Seconds

  const cameraWidth = cameraWrapperWidth;

  // Tentukan background aktif: current (preview saat di menu) atau applied
  const activeBg = selectedCurrentBackground ?? selectedBackground;
  const hasVirtualBg = Boolean(activeBg);

  // Hook virtual background
  const { startRenderLoop, stopRenderLoop } = useVirtualBackground({
    backgroundUrl: activeBg,
    enabled: hasVirtualBg,
    width: cameraWidth || 640,
    height: cameraHeight,
  });

  const updateFrameWidth = () => {
    setCameraWrapperWidth(cameraWrapperRef.current?.clientWidth || 0);
  };

  useEffect(() => {
    updateFrameWidth();
    window.addEventListener("resize", updateFrameWidth);
    return () => {
      window.removeEventListener("resize", updateFrameWidth);
    };
  }, []);

  // Mulai render loop virtual background saat webcam siap
  useEffect(() => {
    if (!hasVirtualBg || !canvasRef.current) return;

    const intervalId = setInterval(() => {
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === 4) {
        clearInterval(intervalId);
        startRenderLoop(video, canvas);
      }
    }, 200);

    return () => {
      clearInterval(intervalId);
      stopRenderLoop();
    };
  }, [hasVirtualBg, startRenderLoop, stopRenderLoop]);

  const capture = useCallback(
    (index: number) => {
      let imageSrc: string | null = null;

      if (hasVirtualBg && canvasRef.current) {
        imageSrc = canvasRef.current.toDataURL("image/jpeg", 0.92);
      } else {
        const webcamEl = webcamRef.current;
        if (webcamEl) {
          imageSrc = webcamEl.getScreenshot();
        }
      }

      if (imageSrc) {
        setPhotos((prev) => {
          const newPhotos = [...prev];
          newPhotos[index] = imageSrc;

          return newPhotos;
        });
      }
    },
    [setPhotos, hasVirtualBg]
  );

  const startCaptureTimer = useCallback(
    (index: number) => {
      setIsTimerOn(true);
      let countdown = 3;

      const intervalId = setInterval(() => {
        setTimeLeft(countdown);

        if (countdown === 0) {
          clearInterval(intervalId);
          capture(index);
          setIsTimerOn(false);
          setLatestCameraIndex(index + 1);
          setRetakeCameraIndex(null);
        }

        countdown -= 1;
      }, 1000);
    },
    [capture, setLatestCameraIndex, setRetakeCameraIndex]
  );

  const handleRetake = (index: number) => {
    setRetakeCameraIndex(index);

    setPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos[index] = null;

      return newPhotos;
    });
  };

  return (
    <Box
      ref={cameraWrapperRef}
      bgcolor="BackgroundSecondary.main"
      height={`${cameraHeight}px`}
      position="relative"
    >
      {index === 0 && (
        <CameraView
          photo={photos[index]}
          webcamRef={webcamRef}
          canvasRef={canvasRef}
          cameraHeight={cameraHeight}
          cameraWidth={cameraWidth}
          latestCameraIndex={latestCameraIndex}
          retakeCameraIndex={retakeCameraIndex}
          index={index}
          handleRetake={handleRetake}
          isTimerOn={isTimerOn}
          startCaptureTimer={startCaptureTimer}
          timeLeft={timeLeft}
          selectedFilter={selectedCurrentFilter || selectedFilter}
          selectedMenu={selectedMenu}
          hasVirtualBg={hasVirtualBg}
        />
      )}

      {index > 0 && photos[index - 1] !== undefined && (
        <CameraView
          photo={photos[index]}
          webcamRef={webcamRef}
          canvasRef={canvasRef}
          cameraHeight={cameraHeight}
          cameraWidth={cameraWidth}
          latestCameraIndex={latestCameraIndex}
          retakeCameraIndex={retakeCameraIndex}
          index={index}
          handleRetake={handleRetake}
          isTimerOn={isTimerOn}
          startCaptureTimer={startCaptureTimer}
          timeLeft={timeLeft}
          selectedFilter={selectedCurrentFilter || selectedFilter}
          selectedMenu={selectedMenu}
          hasVirtualBg={hasVirtualBg}
        />
      )}
    </Box>
  );
};

export default Camera;
