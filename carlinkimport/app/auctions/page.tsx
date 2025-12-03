import React from 'react';

export default function AuctionPage() {
  // Placeholder car data
  const cars = [
    { id: 1, name: "Toyota Camry 2020", image: "https://via.placeholder.com/300x200", price: "$12,000" },
    { id: 2, name: "Honda Accord 2019", image: "https://via.placeholder.com/300x200", price: "$11,500" },
    { id: 3, name: "Ford Mustang 2021", image: "https://via.placeholder.com/300x200", price: "$25,000" },
    { id: 4, name: "Chevrolet Malibu 2020", image: "https://via.placeholder.com/300x200", price: "$10,500" },
  ];

  return (
    <div className=" bg-gray-100 p-4">

      {/* Banner */}
      <div className="w-full max-w-4xl mx-auto bg-gradient-to-r from-[#cbbdc4] to-[#000000] rounded-lg shadow-lg p-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Auction Page
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-6">
          COPART & IAAI აუქციონი მალე დაემატება!
        </p>
        <span className="inline-block bg-white text-[#24262b] font-semibold px-6 py-3 rounded-full text-lg shadow-md animate-pulse">
          COMING SOON
        </span>
      </div>

      {/* Optional Info Text */}
     

    </div>
  );
}
