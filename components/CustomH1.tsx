export default function CustomH1({
  text,
  isPaddingEnabled,
}: {
  text: string;
  isPaddingEnabled: boolean;
}) {
  return <h1 className={`h1 ${isPaddingEnabled ? "mb-5" : ""}`}>{text}</h1>;
}
