import { useCallback, useEffect, useRef } from "react";
import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";

type UseVirtualBackgroundOptions = {
  backgroundUrl: string | null;
  enabled: boolean;
  width: number;
  height: number;
};

export function useVirtualBackground({
  backgroundUrl,
  enabled,
  width,
  height,
}: UseVirtualBackgroundOptions) {
  const segmentationRef = useRef<SelfieSegmentation | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Preload background image
  useEffect(() => {
    if (!backgroundUrl) {
      bgImageRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = backgroundUrl;
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, [backgroundUrl]);

  // Init Segmentation Model
  useEffect(() => {
    if (!enabled) return;

    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    selfieSegmentation.setOptions({
      modelSelection: 0, // 0 for general, 1 for landscape (faster/lighter)
      selfieMode: false,
    });

    segmentationRef.current = selfieSegmentation;

    return () => {
      selfieSegmentation.close();
      segmentationRef.current = null;
    };
  }, [enabled]);

  const processFrame = useCallback(
    (videoElement: HTMLVideoElement, canvas: HTMLCanvasElement) => {
      const segmentation = segmentationRef.current;
      const bgImage = bgImageRef.current;

      if (!segmentation || !bgImage || !enabled) {
        return;
      }

      // Callback onResults hanya perlu diatur sekali, tapi di sini kita pastikan 
      // menggunakan variabel 'canvas' yang dikirim dari argumen fungsi
      segmentation.onResults((results: Results) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Setting Smoothing
        ctx.imageSmoothingEnabled = true;

        // 2. Gambar Masker dengan Feathering (Blur)
        // Ini yang meredam 'noise' atau getaran di pinggir tubuh agar terlihat "lock"
        ctx.filter = 'blur(6px)';
        ctx.globalCompositeOperation = "copy";
        ctx.drawImage(
          results.segmentationMask,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // 3. Masukkan Subjek (Orang)
        ctx.filter = 'none'; // Matikan blur agar orang tetap tajam
        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        // 4. Masukkan Background
        ctx.globalCompositeOperation = "destination-over";
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        ctx.restore();
      });

      segmentation.send({ image: videoElement });
    },
    [enabled]
  );

  // Di dalam startRenderLoop
  const startRenderLoop = useCallback(
    (videoElement: HTMLVideoElement, targetCanvas: HTMLCanvasElement) => {
      const segmentation = segmentationRef.current;

      const render = async () => {
        // Pastikan semua dependency siap
        if (!segmentation || !enabled || !bgImageRef.current) {
          animFrameRef.current = requestAnimationFrame(render);
          return;
        }

        // Callback hasil segmentasi
        segmentation.onResults((results: Results) => {
          // Deklarasi ctx langsung dari targetCanvas yang dipassing di argumen
          const ctx = targetCanvas.getContext("2d");
          if (!ctx) return;

          ctx.save();
          ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

          // --- STRATEGI "LOCK" TEPIAN (ANTI-GOYANG) ---

          // 1. Gambar Masker dengan Feathering (Blur)
          // Blur membantu menyerap 'getaran' piksel dari AI MediaPipe
          ctx.filter = 'blur(4px)';
          ctx.globalCompositeOperation = "copy";
          ctx.drawImage(
            results.segmentationMask,
            0,
            0,
            targetCanvas.width,
            targetCanvas.height
          );

          // 2. Gambar Orang (Subjek)
          // Matikan filter blur agar orangnya tetap tajam, tapi potongannya smooth
          ctx.filter = 'none';
          ctx.globalCompositeOperation = "source-in";
          ctx.drawImage(
            results.image,
            0,
            0,
            targetCanvas.width,
            targetCanvas.height
          );

          // 3. Gambar Background Baru
          ctx.globalCompositeOperation = "destination-over";
          ctx.drawImage(
            bgImageRef.current!,
            0,
            0,
            targetCanvas.width,
            targetCanvas.height
          );

          ctx.restore();
        });

        // Kirim frame ke AI
        await segmentation.send({ image: videoElement });
        animFrameRef.current = requestAnimationFrame(render);
      };

      animFrameRef.current = requestAnimationFrame(render);
    },
    [enabled]
  );

  const stopRenderLoop = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
  }, []);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => stopRenderLoop();
  }, [stopRenderLoop]);

  return { processFrame, startRenderLoop, stopRenderLoop };
}
