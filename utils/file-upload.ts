import { toast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";

export const MAX_FILE_SIZE = 1; // MB

export const fileProps = (onDrop: any) => {
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

  const accept = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
    "text/csv": [".csv"],
    "text/tab-separated-values": [".tsv"],
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept,
    maxSize: MAX_FILE_SIZE * 1024 * 1024, // 2 MB
    multiple: false,
  });

  return { getRootProps, getInputProps, accept };
};
