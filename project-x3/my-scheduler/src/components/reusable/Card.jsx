import '../../styles.css';

function Card({ children, title, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {title && <h2 className="cardTitle">{title}</h2>}
      <div className="cardContent">{children}</div>
    </div>
  );
}

export default Card;