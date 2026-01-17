export default function FeatureBox({ title, items }) {
  return (
    <div className="featureBox">
      <div className="featureTitle">{title}</div>
      <ul className="featureList">
        {items.map((it) => (
          <li key={it.heading} className="featureItem">
            <div className="featureIcon" aria-hidden="true">{it.icon}</div>
            <div>
              <div className="featureHeading">{it.heading}</div>
              <div className="featureDesc">{it.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
