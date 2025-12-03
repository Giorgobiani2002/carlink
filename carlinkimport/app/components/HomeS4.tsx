"use client";
import React, { useState, useMemo } from "react";
import { Calculator, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

// IAAI Fee Structure
const iaaiFee = [
  { range_min: 0.0, range_max: 49.99, fee: 25 },
  { range_min: 50.0, range_max: 99.0, fee: 45 },
  { range_min: 100.0, range_max: 199.99, fee: 80 },
  { range_min: 200.0, range_max: 399.99, fee: 120 },
  { range_min: 400.0, range_max: 499.99, fee: 170 },
  { range_min: 500.0, range_max: 599.99, fee: 195 },
  { range_min: 600.0, range_max: 699.99, fee: 225 },
  { range_min: 700.0, range_max: 799.99, fee: 245 },
  { range_min: 800.0, range_max: 899.99, fee: 270 },
  { range_min: 900.0, range_max: 999.99, fee: 290 },
  { range_min: 1000.0, range_max: 1099.99, fee: 340 },
  { range_min: 1100.0, range_max: 1199.99, fee: 355 },
  { range_min: 1200.0, range_max: 1299.99, fee: 370 },
  { range_min: 1300.0, range_max: 1399.99, fee: 385 },
  { range_min: 1400.0, range_max: 1499.99, fee: 400 },
  { range_min: 1500.0, range_max: 1599.99, fee: 415 },
  { range_min: 1600.0, range_max: 1699.99, fee: 430 },
  { range_min: 1700.0, range_max: 1799.99, fee: 445 },
  { range_min: 1800.0, range_max: 1999.99, fee: 460 },
  { range_min: 2000.0, range_max: 2199.99, fee: 480 },
  { range_min: 2200.0, range_max: 2399.99, fee: 495 },
  { range_min: 2400.0, range_max: 2599.99, fee: 510 },
  { range_min: 2600.0, range_max: 2799.99, fee: 525 },
  { range_min: 2800.0, range_max: 2999.99, fee: 550 },
  { range_min: 3000.0, range_max: 3499.99, fee: 650 },
  { range_min: 3500.0, range_max: 3999.99, fee: 700 },
  { range_min: 4000.0, range_max: 4499.99, fee: 725 },
  { range_min: 4500.0, range_max: 4999.99, fee: 750 },
  { range_min: 5000.0, range_max: 5999.99, fee: 775 },
  { range_min: 6000.0, range_max: 6999.99, fee: 800 },
  { range_min: 7000.0, range_max: 7999.99, fee: 825 },
  { range_min: 8000.0, range_max: 9999.0, fee: 850 },
  { range_min: 10000.0, range_max: 14999.0, fee: 900 },
  { range_min: 15000.0, range_max: null, fee: 7.5, fee_type: "percentage" },
];

// Copart Fee Structure
const copartFee = [
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
  { range_min: 1000.0, range_max: 1199.99, fee: 385.0 },
  { range_min: 1200.0, range_max: 1299.99, fee: 415.0 },
  { range_min: 1300.0, range_max: 1399.99, fee: 435.0 },
  { range_min: 1400.0, range_max: 1499.99, fee: 455.0 },
  { range_min: 1500.0, range_max: 1599.99, fee: 470.0 },
  { range_min: 1600.0, range_max: 1699.99, fee: 495.0 },
  { range_min: 1700.0, range_max: 1799.99, fee: 510.0 },
  { range_min: 1800.0, range_max: 1999.99, fee: 540.0 },
  { range_min: 2000.0, range_max: 2399.99, fee: 590.0 },
  { range_min: 2400.0, range_max: 2499.99, fee: 605.0 },
  { range_min: 2500.0, range_max: 2999.99, fee: 650.0 },
  { range_min: 3000.0, range_max: 3499.99, fee: 775.0 },
  { range_min: 3500.0, range_max: 3999.99, fee: 875.0 },
  { range_min: 4000.0, range_max: 4499.99, fee: 935.0 },
  { range_min: 4500.0, range_max: 4999.99, fee: 1000.0 },
  { range_min: 5000.0, range_max: 5499.99, fee: 1000.0 },
  { range_min: 5500.0, range_max: 5999.99, fee: 1000.0 },
  { range_min: 6000.0, range_max: 6499.99, fee: 1050.0 },
  { range_min: 6500.0, range_max: 6999.99, fee: 1050.0 },
  { range_min: 7000.0, range_max: 7499.99, fee: 1050.0 },
  { range_min: 7500.0, range_max: 7999.99, fee: 1065.0 },
  { range_min: 8000.0, range_max: 8499.99, fee: 1090.0 },
  { range_min: 8500.0, range_max: 8999.99, fee: 1090.0 },
  { range_min: 9000.0, range_max: 9999.99, fee: 1090.0 },
  { range_min: 10000.0, range_max: 10499.99, fee: 1200.0 },
  { range_min: 10500.0, range_max: 10999.99, fee: 1200.0 },
  { range_min: 11000.0, range_max: 11499.99, fee: 1200.0 },
  { range_min: 11500.0, range_max: 11999.99, fee: 1200.0 },
  { range_min: 12000.0, range_max: 12499.99, fee: 1200.0 },
  { range_min: 12500.0, range_max: 14999.99, fee: 1200.0 },
  { range_min: 15000.0, range_max: null, fee: 12.25, fee_type: "percentage" },
];

// Calculate fee based on amount and fee structure
const calculateFee = (amount: number, feeStructure: typeof iaaiFee) => {
  if (isNaN(amount) || amount < 0) return null;

  for (const tier of feeStructure) {
    const inRange =
      amount >= tier.range_min &&
      (tier.range_max === null || amount <= tier.range_max);

    if (inRange) {
      if (tier.fee_type === "percentage") {
        return (amount * tier.fee) / 100;
      }
      return tier.fee;
    }
  }
  return null;
};

export default function FeeCalculator() {
  const [copartAmount, setCopartAmount] = useState("");
  const [iaaiAmount, setIaaiAmount] = useState("");

  const copartFeeResult = useMemo(() => {
    const amount = parseFloat(copartAmount);
    return calculateFee(amount, copartFee);
  }, [copartAmount]);

  const iaaiFeeResult = useMemo(() => {
    const amount = parseFloat(iaaiAmount);
    return calculateFee(amount, iaaiFee);
  }, [iaaiAmount]);

  const copartTotal = useMemo(() => {
    const amount = parseFloat(copartAmount);
    if (isNaN(amount) || copartFeeResult === null) return null;
    return amount + copartFeeResult;
  }, [copartAmount, copartFeeResult]);

  const iaaiTotal = useMemo(() => {
    const amount = parseFloat(iaaiAmount);
    if (isNaN(amount) || iaaiFeeResult === null) return null;
    return amount + iaaiFeeResult;
  }, [iaaiAmount, iaaiFeeResult]);

  return (
    <div className="bg-[#1F1F1F] pb-21 flex flex-col items-center  p-6">
      <div className="w-24 h-1 bg-green-900 mx-auto mb-10 rounded-full"></div>

      <h2 className="text-center text-white text-4xl leading-tight mb-12">
        <span className="text-white font-extrabold">
          დანამატის კალკულატორი
        </span>
      </h2>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Copart Calculator Card */}
        <Card className="bg-[#232323] border-green-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-2xl">
              <Calculator className="h-6 w-6 text-green-900" />
              COPART
            </CardTitle>
            <CardDescription className="text-gray-400">
              Calculate Copart auction fees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Bid Amount ($)
              </label>
              <input
                type="number"
                value={copartAmount}
                onChange={(e) => setCopartAmount(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#181818] text-white border border-green-900/50 focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                placeholder="Enter bid amount"
                min="0"
                step="0.01"
              />
            </div>

            <AnimatePresence>
              {copartAmount &&
                !isNaN(Number(copartAmount)) &&
                copartFeeResult !== null && (
                  <motion.div
                    key="copart-fee"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 p-4 rounded-lg bg-[#181818] border border-green-900/30 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Bid Amount:</span>
                      <span className="text-white font-semibold">
                        ${parseFloat(copartAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Buyer Fee:</span>
                      <span className="text-green-400 font-semibold">
                        ${copartFeeResult.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-px bg-green-900/30 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Total Cost:</span>
                      <span className="text-green-400 font-bold text-xl flex items-center gap-1">
                        <DollarSign className="h-5 w-5" />
                        {copartTotal?.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* IAAI Calculator Card */}
        <Card className="bg-[#232323] border-green-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-2xl">
              <Calculator className="h-6 w-6 text-green-900" />
              IAAI
            </CardTitle>
            <CardDescription className="text-gray-400">
              Calculate IAAI auction fees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Bid Amount ($)
              </label>
              <input
                type="number"
                value={iaaiAmount}
                onChange={(e) => setIaaiAmount(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#181818] text-white border border-green-900/50 focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                placeholder="Enter bid amount"
                min="0"
                step="0.01"
              />
            </div>

            <AnimatePresence>
              {iaaiAmount &&
                !isNaN(Number(iaaiAmount)) &&
                iaaiFeeResult !== null && (
                  <motion.div
                    key="iaai-fee"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 p-4 rounded-lg bg-[#181818] border border-green-900/30 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Bid Amount:</span>
                      <span className="text-white font-semibold">
                        ${parseFloat(iaaiAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Buyer Fee:</span>
                      <span className="text-green-400 font-semibold">
                        ${iaaiFeeResult.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-px bg-green-900/30 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Total Cost:</span>
                      <span className="text-green-400 font-bold text-xl flex items-center gap-1">
                        <DollarSign className="h-5 w-5" />
                        {iaaiTotal?.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Card */}
      <AnimatePresence>
        {copartTotal !== null && iaaiTotal !== null && (
          <motion.div
            key="comparison-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[300px]"
          >
            <Card className="mt-8 w-full max-w-md bg-[#232323] border-green-900/30">
              <CardHeader>
                <CardTitle className="text-white text-xl text-center">
                  Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-center">
                  <p className="text-gray-400 text-sm">
                    {copartTotal < iaaiTotal ? "COPART" : "IAAI"} is cheaper by
                  </p>
                  <p className="text-green-400 font-bold text-2xl">
                    ${Math.abs(copartTotal - iaaiTotal).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
