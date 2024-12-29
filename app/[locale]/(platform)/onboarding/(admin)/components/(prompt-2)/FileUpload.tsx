"use client";

import { useOnboardingContext } from "@/contexts/onboarding-context";
import { fileProps, MAX_FILE_SIZE } from "@/utils/file-upload";
import { properString } from "@/utils/general";
import { useCallback, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import * as XLSX from "xlsx";
import Papa from "papaparse";

export default function FileUpload() {
  const { setUsers } = useOnboardingContext();
  const [fileName, setFileName] = useState("");
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileTypes = {
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      csv: "text/csv",
      tsv: "text/tab-separated-values",
    };
    if (e.target.files) {
      const file = e.target.files[0];
      const filteredJsonData: { emailAddress: string; role: string }[] = [];

      setFileName(file.name);
      if (file.type === fileTypes.xlsx) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result;
          if (data) {
            const workbook = XLSX.read(data, { type: "binary" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            }) as any[];

            const filteredData = jsonData.filter(
              (row, i) =>
                row.length > 0 &&
                ((i > 0 && properString(row[1]) === "Admin") ||
                  properString(row[1]) === "Teacher")
            );

            for (const arr of filteredData) {
              filteredJsonData.push({
                emailAddress: arr[0],
                role: `org:${arr[1]}`.toLowerCase(),
              });
            }
            setUsers(filteredJsonData);
          }
        };
        reader.readAsBinaryString(file);
      } else if (file.type === fileTypes.csv) {
        Papa.parse(file, {
          header: true, // If your CSV has headers
          complete: (result) => {
            type CsvItem = {
              "Email Address": string;
              Role: string;
            };

            for (let i = 0; i < result.data.length; i++) {
              const obj = result.data[i] as unknown as CsvItem;

              if (obj.Role === "Admin" || obj.Role === "Teacher") {
                filteredJsonData.push({
                  emailAddress: obj["Email Address"],
                  role: `org:${obj["Role"]}`.toLowerCase(),
                });
              }
            }

            setUsers(filteredJsonData);
          },
        });
      } else if (file.type === fileTypes.tsv) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const text = e.target?.result as string;
          const rows = text.split("\n").map((row) => row.split("\t"));

          for (const row of rows) {
            const [emailAddress, role] = [row[0], row[1].trim()];

            if (role === "Admin" || role === "Teacher") {
              filteredJsonData.push({
                emailAddress,
                role: `org:${role.toLowerCase()}`,
              });
            }
          }

          setUsers(filteredJsonData);
        };

        reader.readAsText(file);
      }
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      // await loadImage(file); // Add custom validation here if needed (e.g. checking aspect ratio)
      // await handleFileUpload(); // Validation passed
    },
    [handleFileUpload]
  );

  const { getRootProps, getInputProps, accept } = fileProps(onDrop);

  return (
    <div className="flex flex-col">
      <div
        {...getRootProps({
          className:
            "dropzone-border size-full flex flex-col items-center justify-center p-5 rounded-xl cursor-pointer",
        })}
      >
        <input {...getInputProps()} onChange={handleFileUpload} />
        <MdFileUpload className="w-14 h-14 text-muted-foreground" />

        <p className="text-lg font-bold hover:underline">
          Drag and drop or click here
        </p>

        <p className="text-xs text-muted-foreground">
          Accepted types: .xlsx, .csv, .tsv ({MAX_FILE_SIZE} MB max)
        </p>
      </div>
      {fileName !== "" && (
        <span className="mt-3 font-medium text-sm">
          <span className="font-bold">Selected File:</span> {fileName}
        </span>
      )}
    </div>
  );
}
