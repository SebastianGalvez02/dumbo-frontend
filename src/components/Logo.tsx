export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`logo ${light ? "logo-light" : ""}`}>
      <span className="logo-mark">D</span>
      <span className="logo-copy">
        <strong>Dumbo</strong>
        <small>Supermercados</small>
      </span>
    </div>
  );
}
