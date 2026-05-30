"use client";

export function MapCanvas() {
  return (
    <div className="relative w-full h-full min-h-[200px] bg-[#080f22] overflow-hidden rounded-xl">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="road h" style={{ top: "35%" }} />
      <div className="road h thick" style={{ top: "62%" }} />
      <div className="road v" style={{ left: "28%" }} />
      <div className="road v thick" style={{ left: "60%" }} />
      <div
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
