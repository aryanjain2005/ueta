import React from 'react'

const Distributor: React.FC = () => {
  const images = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9GCHfZwy5mWTCWhq0yhf5abS2MSODFaO2jA&s',
    'https://www.shutterstock.com/image-photo/young-smiling-business-university-student-260nw-1937739820.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9GCHfZwy5mWTCWhq0yhf5abS2MSODFaO2jA&s',
    'https://www.shutterstock.com/image-photo/young-smiling-business-university-student-260nw-1937739820.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9GCHfZwy5mWTCWhq0yhf5abS2MSODFaO2jA&s',
    'https://www.shutterstock.com/image-photo/young-smiling-business-university-student-260nw-1937739820.jpg'
  ]

  return (
    <div className="flex flex-wrap -mx-4">
      {images.map((image, index) => (
        <div key={index} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
          <div className="bg-white p-4 border rounded-md shadow-md">
            <img
              src={image}
              alt={`Brand ${index}`}
              className="w-full h-auto rounded-md"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Distributor
