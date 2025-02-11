export default function AddStudents() {
  return (
    <div className="h-full flex flex-col p-5 border rounded-lg bg-primary-foreground">
      <h2 className="h2">Add your first student(s).</h2>
      <span>You can do this later if you prefer.</span>

      <h2 className="h2">
        Do you want to set up accounts for parents and guardians?
      </h2>
      <span>
        You can set up accounts for them or have them set up their own accounts
        later.
      </span>
    </div>
  );
}
