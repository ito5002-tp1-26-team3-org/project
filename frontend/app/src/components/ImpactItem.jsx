export default function ImpactItem({ value, label, note }) {
  return (
    <div>
      <div className="impactValue">{value}</div>
      <div className="impactLabel">{label}</div>
      <div className="impactNote">{note}</div>
    </div>
  );
}
