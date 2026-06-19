
export default function NoticeRowCard({ data, onClick, isActive }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-4 rounded-xl cursor-pointer transition-all duration-300 border-2
        ${isActive 
          ? 'bg-brand-white border-brand-dark shadow-md' 
          : 'bg-brand-white border-transparent hover:border-brand-gray/20 shadow-sm'}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Date Box */}
        <div className="flex flex-col items-center justify-center bg-brand-gray/10 rounded-lg p-2 min-w-[3.5rem]">
          <span className="font-heading font-black text-brand-dark text-lg leading-none">
            {data.date.day}
          </span>
          <span className="font-body font-bold text-brand-primary text-[10px] uppercase tracking-wider">
            {data.date.month}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, idx) => (
              <span 
                key={idx}
                className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  tag === 'IMPORTANT' ? 'bg-red-100 text-red-600' : 'bg-brand-blue/10 text-brand-blue'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-heading font-bold text-brand-dark text-sm leading-tight group-hover:text-brand-primary transition-colors">
            {data.title}
          </h3>
          <p className="text-[10px] text-brand-dark/50 font-medium">
            {data.audience}
          </p>
        </div>
      </div>
    </div>
  );
}