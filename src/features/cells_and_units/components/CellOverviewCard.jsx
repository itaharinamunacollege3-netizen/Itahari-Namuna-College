import { Link } from "react-router-dom";

export default function CellOverviewCard({ unit, borderColor }) {
  const cardStyle = {
    borderTop: `4px solid ${borderColor}`,
    borderRadius: "12px", // Slightly more rounded to feel modern
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    padding: "24px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  };

  return (
    <div style={cardStyle} className="cell-card">
      {/* Icon Placeholder */}
      <div className="w-full h-50 bg-gray-50 border border-gray-100 rounded-2xl mb-5 flex items-center justify-center overflow-hidden shadow-inner shrink-0 relative">
        <img loading="lazy" decoding="async"
          src={unit.icon}
          alt={unit.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Header Section as per image_84bf45.png */}
      <div className="mb-3">
        <h3 className="text-xl font-bold text-gray-900">{unit.title}</h3>
        <p className="text-sm font-medium" style={{ color: borderColor }}>
          {unit.subtitle || unit.category || "Committee"}
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6 grow">
        {unit.description ||
          "IQAC drives continuous quality enhancement across academics, administration, and student development."}
      </p>

      {/* View Details Button as per image_84bf45.png */}
      <Link
        to={`/cells-and-units/${unit.id}`}
        className="block w-full text-center py-2.5 rounded-lg border border-brand-primary text-brand-primary duration-300 hover:text-brand-white hover:bg-brand-primary font-semibold text-sm transition-colors"
      >
        View Details
      </Link>
    </div>
  );
}
