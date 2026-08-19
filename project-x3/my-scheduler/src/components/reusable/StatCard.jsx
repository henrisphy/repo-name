import "../../styles.css";

function StatCard({ label, value, color }) {
  return (
    <div className="statCard">
      <h3>{label}</h3>
      <p
        className="statNumber"
        style={{ color: color || "var(--text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}

export default StatCard;