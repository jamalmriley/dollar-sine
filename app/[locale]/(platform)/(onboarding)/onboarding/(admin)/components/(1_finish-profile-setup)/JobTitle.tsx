"use client";

import { Input } from "@/components/ui/input";
import { useActiveUserContext } from "@/contexts/active-user-context";
import { useQueryState } from "nuqs";

export default function JobTitle() {
  const [jobTitle, setJobTitle] = useQueryState("jobTitle", {
    defaultValue: "",
  });

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="hidden md:flex flex-col">
        <span
          className={`text-sm font-semibold ${
            jobTitle !== "" ? "text-muted-foreground line-through" : ""
          }`}
        >
          Set your job title.
        </span>
        <span className="text-xs font-medium text-muted-foreground mb-2">
          What do you do at your organization?
        </span>
      </div>

      {/* Input */}
      <Input
        id="job-title"
        name="job-title"
        placeholder="(e.g. 8th grade teacher)"
        type="text"
        autoComplete="organization-title"
        required
        value={jobTitle}
        onChange={(e) => {
          setJobTitle(e.target.value);
        }}
      />
    </div>
  );
}
