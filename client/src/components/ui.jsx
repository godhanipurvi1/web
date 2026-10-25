export const RUPEE = "\u20B9";

export function Card({ children }) {
  return <div className="card">{children}</div>;
}

export function ErrorNotice({ message }) {
  if (!message) return null;
  return <p className="error">{message}</p>;
}

export function StatusPill({ value, label }) {
  return <span className={"pill " + value}>{label ?? value}</span>;
}

export function Button({ children, onClick, primary = false }) {
  return (
    <button className={"btn" + (primary ? " primary" : "")} onClick={onClick}>
      {children}
    </button>
  );
}

export function PlaceholderPage({ name }) {
  return (
    <div className="card page-note">
      <p>{name} is coming soon.</p>
    </div>
  );
}
