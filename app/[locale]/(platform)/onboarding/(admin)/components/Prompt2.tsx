import React from "react";

export default function Prompt2() {
  return (
    <div>
      <h2 className="h2">Add your colleague(s).</h2>
      <span>
        You can do this later if you prefer. Note that different accounts have
        different levels of access and permissions.
      </span>

      <h2 className="h2">Add your first student(s)</h2>
      <span>You can do this later if you prefer.</span>

      <h2 className="h2">
        Do you want to set up accounts for parents and guardians?
      </h2>
      <span>
        You can set up accounts for them or have them set up their own accounts
        later.
      </span>

      <h2 className="h2">Assign your students to classes.</h2>
      <span>You can do this later if you prefer.</span>
    </div>
  );
}
