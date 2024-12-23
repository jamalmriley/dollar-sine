"use client";

import { toast } from "@/hooks/use-toast";
import { imageProps, loadImage, MAX_FILE_SIZE } from "@/utils/image-upload";
import { useUser } from "@clerk/nextjs";
import { useCallback } from "react";
import { MdFileUpload } from "react-icons/md";

export default function ProfileImageUpload() {
  const { isLoaded, user } = useUser();
  const handleImageUpload = async (file: File) => {
    if (!isLoaded || !user) return null;
    if (user) {
      await user
        .setProfileImage({ file })
        .then(() => {
          toast({
            title: `Looking good, ${user.firstName}!`,
            description: "Your profile picture has successfully been updated.",
          });
        })
        .catch((err) => {
          console.error(err);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "We couldn't update your profile picture. Please try again.",
          });
        });
      // .then((res) => console.log(res))
      // .catch((error) => console.log("An error occurred:", error.errors));
    }
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
          "dropzone-border w-full flex flex-col items-center justify-center p-10 rounded-xl cursor-pointer",
      })}
    >
      <input {...getInputProps()} />
      <MdFileUpload className="w-14 h-14 text-muted-foreground" />

      <p className="text-lg font-bold hover:underline">
        Drag and drop or click here
      </p>

      <p className="text-xs text-muted-foreground">
        Accepted types: .jpg, .jpeg, .png, .heic ({MAX_FILE_SIZE} MB max)
      </p>
    </div>
  );
}
