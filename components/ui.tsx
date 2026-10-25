export function Arrow() {
  return (
    <span aria-hidden="true" className="arrow">
      ↗
    </span>
  );
}
export function SectionHeading({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div className="eyebrow">
        <span className="section-number">{number}</span>
        {label}
      </div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
export function PageHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-heading">
      <div className="eyebrow">
        <span className="orange">/</span> {label}
      </div>
      <h1>
        {title}
        <span className="orange">.</span>
      </h1>
      <p>{description}</p>
    </header>
  );
}
