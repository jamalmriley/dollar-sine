"use client";

import { useOnboardingContext } from "@/contexts/onboarding-context";
import { imageProps, loadImage, MAX_FILE_SIZE } from "@/utils/image-upload";
import Image from "next/image";
import { useCallback } from "react";
import { MdPhotoCamera } from "react-icons/md";

export default function ProfileImageUpload() {
  const { profilePic, setProfilePic } = useOnboardingContext();
  const handleImageUpload = async (file: File) => {
    setProfilePic(file);
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
      <input {...getInputProps()} id="profile-pic-input" />

      <div
        className={`size-14 ${
          profilePic ? "p-0" : "p-3"
        } rounded-md border overflow-hidden`}
      >
        {profilePic ? (
          <Image
            src={URL.createObjectURL(profilePic)}
            width={56}
            height={56}
            alt={profilePic.name}
            loading="eager"
            className="overflow-hidden"
          />
        ) : (
          <MdPhotoCamera className="size-full text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-col">
        <p className="label hover:underline">
          Upload a profile picture (optional)
        </p>

        <p className="text-xs text-muted-foreground">
          Accepted types: .jpg, .jpeg, .png, .heic
        </p>
        <p className="text-xs text-muted-foreground">
          ({MAX_FILE_SIZE} MB max)
        </p>
      </div>
    </div>
  );
}
