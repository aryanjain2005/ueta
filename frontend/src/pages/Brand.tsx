import React from 'react';

const Brand: React.FC = () => {
  // Mock data for images (replace with actual image URLs)
  const images = [
    'https://logowik.com/content/uploads/images/157_haier_logo.jpg', // Example URL, replace with actual image URLs
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlfeXCGJaX841E4W3n_iLoJaDBBZQvHWyCJA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV-zfnRcki7KKvfVSEFisOZdqP4e94I5wRzg&s',
    'https://logowik.com/content/uploads/images/157_haier_logo.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlfeXCGJaX841E4W3n_iLoJaDBBZQvHWyCJA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV-zfnRcki7KKvfVSEFisOZdqP4e94I5wRzg&s',
    'https://logowik.com/content/uploads/images/157_haier_logo.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlfeXCGJaX841E4W3n_iLoJaDBBZQvHWyCJA&s',
  ];

  return (
    <div className="flex flex-wrap -mx-4">
      {images.map((image, index) => (
        <div key={index} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
          <div className="bg-white p-4 border rounded-md shadow-md">
            <img src={image} alt={`Brand ${index}`} className="w-full h-auto rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Brand;
