import { supabase } from "@src/helpers/supabase-client";
import { useMutation } from "@tanstack/react-query";

export type UploadData = { id: string; path: string; fullPath: string };

const uploadImage = async (payload: {
  base64Image: string;
  event: string | null;
}) => {
  try {
    const { base64Image, event = "photobooth" } = payload;

    const fileName = `MJS-${Date.now()}`;
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    const { data, error } = await supabase.storage
      .from(event || "photobooth")
      .upload(`${fileName}.png`, imageBuffer, {
        contentType: "image/png",
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    return { data, error };
  } catch (error) {
    throw error;
  }
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImage,
  });
};
