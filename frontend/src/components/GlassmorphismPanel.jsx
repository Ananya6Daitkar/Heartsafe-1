export function GlassmorphismPanel({ children, className = '' }) {
  return (
    <div
      className={`
        backdrop-blur-md
        bg-white/10
        border border-white/20
        rounded-2xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}
