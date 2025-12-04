"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const iaaiFee = [
  { range_min: 0.0, range_max: 49.99, fee: 25 },
  { range_min: 50.0, range_max: 99.0, fee: 45 },
  { range_min: 100.0, range_max: 199.99, fee: 80 },
  { range_min: 200.0, range_max: 399.99, fee: 270 },
  { range_min: 400.0, range_max: 499.99, fee: 340 },
  { range_min: 500.0, range_max: 599.99, fee: 370 },
  { range_min: 600.0, range_max: 699.99, fee: 425 },
  { range_min: 700.0, range_max: 799.99, fee: 440 },
  { range_min: 800.0, range_max: 899.99, fee: 450 },
  { range_min: 900.0, range_max: 999.99, fee: 460 },
  { range_min: 1000.0, range_max: 1099.99, fee: 500 },
  { range_min: 1100.0, range_max: 1199.99, fee: 520 },
  { range_min: 1200.0, range_max: 1299.99, fee: 535 },
  { range_min: 1300.0, range_max: 1399.99, fee: 550 },
  { range_min: 1400.0, range_max: 1499.99, fee: 575 },
  { range_min: 1500.0, range_max: 1599.99, fee: 590 },
  { range_min: 1600.0, range_max: 1699.99, fee: 610 },
  { range_min: 1700.0, range_max: 1799.99, fee: 630 },
  { range_min: 1800.0, range_max: 1999.99, fee: 660 },
  { range_min: 2000.0, range_max: 2199.99, fee: 670 },
  { range_min: 2200.0, range_max: 2399.99, fee: 700 },
  { range_min: 2400.0, range_max: 2599.99, fee: 725 },
  { range_min: 2600.0, range_max: 2799.99, fee: 735 },
  { range_min: 2800.0, range_max: 2999.99, fee: 780 },
  { range_min: 3000.0, range_max: 3499.99, fee: 830 },
  { range_min: 3500.0, range_max: 3999.99, fee: 885 },
  { range_min: 4000.0, range_max: 4499.99, fee: 910 },
  { range_min: 4500.0, range_max: 4999.99, fee: 940 },
  { range_min: 5000.0, range_max: 5999.99, fee: 1100 },
  { range_min: 6000.0, range_max: 6999.99, fee: 1065 },
  { range_min: 7000.0, range_max: 7999.99, fee: 1125 },
  { range_min: 8000.0, range_max: 9999.0, fee: 1145 },
  { range_min: 10000.0, range_max: 14999.0, fee: 1225 },
  { range_min: 15000.0, range_max: null, fee: 7.5, fee_type: "percentage" },
];

export const copartFee = [
  { range_min: 0, range_max: 49.99, fee: 27.5 },
  { range_min: 50.0, range_max: 99.99, fee: 50.0 },
  { range_min: 100.0, range_max: 199.99, fee: 90.0 },
  { range_min: 200.0, range_max: 299.99, fee: 135.0 },
  { range_min: 300.0, range_max: 349.99, fee: 137.5 },
  { range_min: 350.0, range_max: 399.99, fee: 140.0 },
  { range_min: 400.0, range_max: 449.99, fee: 182.5 },
  { range_min: 450.0, range_max: 499.99, fee: 185.0 },
  { range_min: 500.0, range_max: 549.99, fee: 212.5 },
  { range_min: 550.0, range_max: 599.99, fee: 215.0 },
  { range_min: 600.0, range_max: 699.99, fee: 245.0 },
  { range_min: 700.0, range_max: 799.99, fee: 270.0 },
  { range_min: 800.0, range_max: 899.99, fee: 295.0 },
  { range_min: 900.0, range_max: 999.99, fee: 325.0 },
  { range_min: 1000.0, range_max: 1199.99, fee: 465.0 },
  { range_min: 1200.0, range_max: 1299.99, fee: 485.0 },
  { range_min: 1300.0, range_max: 1399.99, fee: 500.0 },
  { range_min: 1400.0, range_max: 1499.99, fee: 515.0 },
  { range_min: 1500.0, range_max: 1599.99, fee: 540.0 },
  { range_min: 1600.0, range_max: 1699.99, fee: 555.0 },
  { range_min: 1700.0, range_max: 1799.99, fee: 575.0 },
  { range_min: 1800.0, range_max: 1999.99, fee: 595.0 },
  { range_min: 2000.0, range_max: 2399.99, fee: 630.0 },
  { range_min: 2400.0, range_max: 2499.99, fee: 665.0 },
  { range_min: 2500.0, range_max: 2999.99, fee: 700.0 },
  { range_min: 3000.0, range_max: 3499.99, fee: 745.0 },
  { range_min: 3500.0, range_max: 3999.99, fee: 795.0 },
  { range_min: 4000.0, range_max: 4499.99, fee: 855.0 },
  { range_min: 4500.0, range_max: 4999.99, fee: 880.0 },
  { range_min: 5000.0, range_max: 5499.99, fee: 905.0 },
  { range_min: 5500.0, range_max: 5999.99, fee: 930.0 },
  { range_min: 6000.0, range_max: 6499.99, fee: 975.0 },
  { range_min: 6500.0, range_max: 6999.99, fee: 995.0 },
  { range_min: 7000.0, range_max: 7499.99, fee: 1030.0 },
  { range_min: 7500.0, range_max: 7999.99, fee: 1050.0 },
  { range_min: 8000.0, range_max: 8499.99, fee: 1090.0 },
  { range_min: 8500.0, range_max: 8999.99, fee: 1110.0 },
  { range_min: 9000.0, range_max: 9999.99, fee: 1140.0 },
  { range_min: 10000.0, range_max: 10499.99, fee: 1165.0 },
  { range_min: 10500.0, range_max: 10999.99, fee: 1190.0 },
  { range_min: 11000.0, range_max: 11499.99, fee: 1195.0 },
  { range_min: 11500.0, range_max: 11999.99, fee: 1205.0 },
  { range_min: 12000.0, range_max: 12499.99, fee: 1250.0 },
  { range_min: 12500.0, range_max: 14999.99, fee: 1.0 },
  { range_min: 15000.0, range_max: null, fee_type: "percentage", fee: 12.25 },
];

const calculateFee = (amount: number, feeStructure: typeof iaaiFee) => {
  if (isNaN(amount) || amount < 0) return null;
  for (const tier of feeStructure) {
    const inRange =
      amount >= tier.range_min &&
      (tier.range_max === null || amount <= tier.range_max);
    if (inRange) {
      if (tier.fee_type === "percentage") return (amount * tier.fee) / 100;
      return tier.fee;
    }
  }
  return null;
};

export default function FeeCalculator() {
  const [copartAmount, setCopartAmount] = useState("");
  const [iaaiAmount, setIaaiAmount] = useState("");

  const copartFeeResult =
    copartAmount && !isNaN(Number(copartAmount))
      ? calculateFee(parseFloat(copartAmount), copartFee)
      : null;

  const iaaiFeeResult =
    iaaiAmount && !isNaN(Number(iaaiAmount))
      ? calculateFee(parseFloat(iaaiAmount), iaaiFee)
      : null;

  const copartTotal =
    copartFeeResult !== null
      ? parseFloat(copartAmount || "0") + copartFeeResult
      : null;

  const iaaiTotal =
    iaaiFeeResult !== null
      ? parseFloat(iaaiAmount || "0") + iaaiFeeResult
      : null;

  return (
    <div id="calculator" className="bg-[#1F1F1F] pb-12 flex flex-col items-center p-6 ">
      <div className="w-24 h-1 bg-red-800 mx-auto mb-10 rounded-full"></div>

      <h2 className="text-center text-red-800 text-4xl leading-tight mb-12 font-extrabold">
        დანამატის <span className="text-white">კალკულატორი</span> 
      </h2>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Copart Card */}
        <Card className="bg-[#232323] border border-green-900/30">
          <CardHeader>
            <CardTitle className="text-white text-2xl">COPART</CardTitle>
            <CardDescription className="text-gray-400">
              Calculate Copart auction fees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="number"
              value={copartAmount}
              onChange={(e) => setCopartAmount(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#181818] text-white border border-green-900/50 focus:outline-none focus:ring-2 focus:ring-green-900"
              placeholder="Enter bid amount"
              min="0"
              step="0.01"
            />

            {copartFeeResult !== null && (
              <div className="mt-6 p-4 rounded-lg bg-[#181818] border border-green-900/30 space-y-2 transition-all duration-300">
                <div className="flex justify-between text-white">
                  <span>Bid Amount:</span>
                  <span>${parseFloat(copartAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Buyer Fee:</span>
                  <span>${copartFeeResult.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold">
                  <span>Total Cost:</span>
                  <span>${copartTotal?.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* IAAI Card */}
        <Card className="bg-[#232323] border border-green-900/30">
          <CardHeader>
            <CardTitle className="text-white text-2xl">IAAI</CardTitle>
            <CardDescription className="text-gray-400">
              Calculate IAAI auction fees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="number"
              value={iaaiAmount}
              onChange={(e) => setIaaiAmount(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#181818] text-white border border-green-900/50 focus:outline-none focus:ring-2 focus:ring-green-900"
              placeholder="Enter bid amount"
              min="0"
              step="0.01"
            />

            {iaaiFeeResult !== null && (
              <div className="mt-6 p-4 rounded-lg bg-[#181818] border border-green-900/30 space-y-2 transition-all duration-300">
                <div className="flex justify-between text-white">
                  <span>Bid Amount:</span>
                  <span>${parseFloat(iaaiAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Buyer Fee:</span>
                  <span>${iaaiFeeResult.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold">
                  <span>Total Cost:</span>
                  <span>${iaaiTotal?.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison */}
      {copartTotal !== null && iaaiTotal !== null && (
        <div className="mt-8 w-full max-w-md">
          <Card className="bg-[#232323] border border-green-900/30">
            <CardHeader>
              <CardTitle className="text-white text-xl text-center">
                Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-gray-400 text-sm">
                {copartTotal < iaaiTotal ? "COPART" : "IAAI"} is cheaper by
              </p>
              <p className="text-green-400 font-bold text-2xl">
                ${Math.abs(copartTotal - iaaiTotal).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
