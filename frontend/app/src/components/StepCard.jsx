export default function StepCard({ number, title, children }) {
  return (
    <div className="stepCard">
      <div className="stepHeader">
        <div className="stepBadge">{number}</div>
        <div className="stepTitle">{title}</div>
      </div>
      <div className="stepBody">{children}</div>
    </div>
  );
}
