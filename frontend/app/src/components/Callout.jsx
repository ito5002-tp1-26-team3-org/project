export default function Callout({ title, children }) {
  return (
    <div className="callout">
      <div className="calloutIcon" aria-hidden="true">⚠️</div>
      <div>
        <div className="calloutTitle">{title}</div>
        <div className="calloutBody">{children}</div>
      </div>
    </div>
  );
}
