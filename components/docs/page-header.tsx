export function DocsPageHeader({
  heading,
  text,
}: {
  heading: string;
  text?: string;
}) {
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-4xl">{heading}</h1>
      {text && <p className="text-xl text-muted-foreground">{text}</p>}
    </div>
  );
}

export default DocsPageHeader;
