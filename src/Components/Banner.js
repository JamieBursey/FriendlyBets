const bannerStyles = {
  width: "100%",
  height: 100,
  objectFit: "none",
  objectPosition: "center",
};
const bannerTextStyles = {
  fontWeight: "bold",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  letterSpacing: "0.1em",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  background: "linear-gradient(45deg, #00b4d8, #90e0ef)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  display: "inline",
};
function Banner() {
  return (
    <div
      style={bannerStyles}
      className="text-center text-success text-bg-dark p-3"
    >
      <p style={bannerTextStyles} className="fs-1 fs-2-sm">
        Friendly Bets
      </p>
    </div>
  );
}

export default Banner;
export { bannerTextStyles };
