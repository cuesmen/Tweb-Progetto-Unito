export default function HomeCarouselSkeleton({ count = 8 }) {
  return (
    <div className="carousel-viewport">
      <ul className="carousel-track">
        {Array.from({ length: count }).map((_, index) => (
          <li key={index} className="carousel-card">
            <div className="carousel-item skeleton">
              <div className="carousel-media skeleton-box" />
              <div className="carousel-info">
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
