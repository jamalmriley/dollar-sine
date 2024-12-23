import { toast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";

export const MAX_FILE_SIZE = 2; // MB

export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
  });
};

export const imageProps = (onDrop: any) => {
  const onDropRejected = useCallback(
    (fileRejections: FileRejection[], event: DropEvent) => {
      const fileRejection = fileRejections[0];
      const fileError = fileRejection.errors[0];
      if (fileError.code === "file-too-large") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `The file is too large. The max file size is ${MAX_FILE_SIZE} MB.`,
        });
      }
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/heic": [".heic"],
    },
    maxSize: MAX_FILE_SIZE * 1024 * 1024, // 2 MB
    multiple: false,
  });

  return { getRootProps, getInputProps };
};
