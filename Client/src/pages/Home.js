import React, { useEffect, useState } from 'react';

// Replace these URLs with your own image addresses.
// You can also use local imports if you prefer.
const slides = [
  {
    title: 'Fresh Gourmet Pizza',
    subtitle: 'Sizzling slices loaded with flavor',
    image: 'https://images.unsplash.com/photo-1447078806655-40579c2520d6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Juicy Burger Classics',
    subtitle: 'Perfectly stacked and ready to enjoy',
    image: 'https://plus.unsplash.com/premium_photo-1663852297514-2211cfb8ae9b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Colorful Salad Bowls',
    subtitle: 'Fresh ingredients, vibrant taste',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Savory Pasta Creations',
    subtitle: 'Creamy, rich, unforgettable dishes',
    image: 'https://images.unsplash.com/photo-1662197480393-2a82030b7b83?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Sweet Dessert Favorites',
    subtitle: 'Finish your meal with indulgence',
    image: 'https://images.unsplash.com/photo-1775595712043-50ae4b305124?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero">
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>Welcome to Urban Spoon</h1>
        <p>Delicious food, served with love and authenticity.</p>
        <a href="/menu" className="hero-button">Explore Menu</a>
      </div>
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={index === activeSlide ? 'dot active-dot' : 'dot'}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;