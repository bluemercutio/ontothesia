import React, { useState } from "react";

interface CarouselProps {
  children: React.ReactNode[];
}

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = React.Children.count(children);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalItems - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalItems - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl px-12">
      <div className="overflow-hidden">
        <div
          className="transition-transform duration-500 ease-in-out flex gap-6"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {React.Children.map(children, (child) => (
            <div className="w-full flex-shrink-0">
              <div className="flex justify-center items-center">{child}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[var(--primary-bg)] hover:bg-[var(--primary-bg-hover)] rounded-full p-3 shadow-lg z-10 transition-all hover:scale-110"
        aria-label="Previous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="var(--foreground)"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[var(--primary-bg)] hover:bg-[var(--primary-bg-hover)] rounded-full p-3 shadow-lg z-10 transition-all hover:scale-110"
        aria-label="Next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="var(--foreground)"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      <div className="flex justify-center gap-3 mt-6">
        {React.Children.map(children, (_, index) => (
          <button
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index
                ? "bg-[var(--foreground)] scale-110"
                : "bg-[var(--primary-bg)] hover:bg-[var(--primary-bg-hover)]"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
