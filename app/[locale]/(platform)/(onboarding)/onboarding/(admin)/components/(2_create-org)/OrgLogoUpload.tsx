"use client";

import { useOnboardingContext } from "@/contexts/onboarding-context";
import { imageProps, loadImage, MAX_FILE_SIZE } from "@/utils/image-upload";
import { useCallback } from "react";
import { MdPhotoCamera } from "react-icons/md";

export default function OrgLogoUpload() {
  const { orgLogo, setOrgLogo } = useOnboardingContext();
  const handleImageUpload = async (file: File) => {
    setOrgLogo(file);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      await loadImage(file); // Add custom validation here if needed (e.g. checking aspect ratio)
      await handleImageUpload(file); // Validation passed
    },
    [handleImageUpload]
  );

  const { getRootProps, getInputProps } = imageProps(onDrop);

  return (
    <div
      {...getRootProps({
        className:
          "w-full flex items-center p-3 gap-3 border-2 border-dashed rounded-md cursor-pointer",
      })}
    >
      <input {...getInputProps()} id="org-logo-input" />
      <div
        className={`size-14 flex justify-center items-center ${
          orgLogo ? "p-0" : "p-3"
        } rounded-md border overflow-hidden`}
      >
        {orgLogo ? (
          <img src={URL.createObjectURL(orgLogo)} />
        ) : (
          <MdPhotoCamera className="size-full text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-col">
        <p className="label hover:underline">
          Upload a company logo (optional)
        </p>

        <p className="text-xs text-muted-foreground">
          Accepted types: .jpg, .jpeg, .png, .heic ({MAX_FILE_SIZE} MB max)
        </p>
      </div>
    </div>
  );
}
