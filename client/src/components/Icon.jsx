const PATHS = {
  grid: "M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 14h7v6H4z",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6",
  fork: "M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 21V3c-2.5 1.5-3 5-3 8h3",
  tag: "M3 12V4h8l10 10-8 8L3 12zM7.5 8.5h.01",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-4 3.1-6 7-6s7 2 7 6M16 4a4 4 0 0 1 0 7M18 15c2.2.6 4 2.3 4 6",
  card: "M3 6h18v12H3zM3 10h18M7 15h3",
  bike: "M5 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 15l3-6h4l4 6M11 9L9.5 6H7",
  chart: "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6 8-6s8 2 8 6",
};

export default function Icon({ name }) {
  return (
    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}