export type AuctionProvider = "copart" | "iaai";

export type LocationTariff = {
  id: string;
  auction: AuctionProvider;
  state: string;
  city: string;
  transportPrice: number;
  active: boolean;
};

export type FeaturedVehicle = {
  id: string;
  brand: string;
  model: string;
  engine: string;
  yearFrom: number;
  yearTo: number;
  horsepower: number;
  fuel: string;
  drive: string;
  imageUrl: string;
  priceFrom: number;
  priceTo: number;
  active: boolean;
};

export type CalculationResult = {
  carPrice: number;
  auctionFee: number;
  transportTotal: number;
  total: number;
};

type FeeTier = {
  range_min: number;
  range_max: number | null;
  fee: number;
  fee_type?: "percentage";
};

const iaaiFee: FeeTier[] = [
  { range_min: 0, range_max: 49.99, fee: 25 },
  { range_min: 50, range_max: 99, fee: 45 },
  { range_min: 100, range_max: 199.99, fee: 80 },
  { range_min: 200, range_max: 399.99, fee: 270 },
  { range_min: 400, range_max: 499.99, fee: 340 },
  { range_min: 500, range_max: 599.99, fee: 370 },
  { range_min: 600, range_max: 699.99, fee: 425 },
  { range_min: 700, range_max: 799.99, fee: 440 },
  { range_min: 800, range_max: 899.99, fee: 450 },
  { range_min: 900, range_max: 999.99, fee: 460 },
  { range_min: 1000, range_max: 1099.99, fee: 500 },
  { range_min: 1100, range_max: 1199.99, fee: 520 },
  { range_min: 1200, range_max: 1299.99, fee: 535 },
  { range_min: 1300, range_max: 1399.99, fee: 550 },
  { range_min: 1400, range_max: 1499.99, fee: 575 },
  { range_min: 1500, range_max: 1599.99, fee: 590 },
  { range_min: 1600, range_max: 1699.99, fee: 610 },
  { range_min: 1700, range_max: 1799.99, fee: 630 },
  { range_min: 1800, range_max: 1999.99, fee: 660 },
  { range_min: 2000, range_max: 2199.99, fee: 670 },
  { range_min: 2200, range_max: 2399.99, fee: 700 },
  { range_min: 2400, range_max: 2599.99, fee: 725 },
  { range_min: 2600, range_max: 2799.99, fee: 735 },
  { range_min: 2800, range_max: 2999.99, fee: 780 },
  { range_min: 3000, range_max: 3499.99, fee: 830 },
  { range_min: 3500, range_max: 3999.99, fee: 885 },
  { range_min: 4000, range_max: 4499.99, fee: 910 },
  { range_min: 4500, range_max: 4999.99, fee: 940 },
  { range_min: 5000, range_max: 5999.99, fee: 1100 },
  { range_min: 6000, range_max: 6999.99, fee: 1065 },
  { range_min: 7000, range_max: 7999.99, fee: 1125 },
  { range_min: 8000, range_max: 9999, fee: 1145 },
  { range_min: 10000, range_max: 14999, fee: 1225 },
  { range_min: 15000, range_max: null, fee: 7.5, fee_type: "percentage" },
];

const copartFee: FeeTier[] = [
  { range_min: 0, range_max: 49.99, fee: 27.5 },
  { range_min: 50, range_max: 99.99, fee: 50 },
  { range_min: 100, range_max: 199.99, fee: 90 },
  { range_min: 200, range_max: 299.99, fee: 135 },
  { range_min: 300, range_max: 349.99, fee: 137.5 },
  { range_min: 350, range_max: 399.99, fee: 140 },
  { range_min: 400, range_max: 449.99, fee: 182.5 },
  { range_min: 450, range_max: 499.99, fee: 185 },
  { range_min: 500, range_max: 549.99, fee: 212.5 },
  { range_min: 550, range_max: 599.99, fee: 215 },
  { range_min: 600, range_max: 699.99, fee: 245 },
  { range_min: 700, range_max: 799.99, fee: 270 },
  { range_min: 800, range_max: 899.99, fee: 295 },
  { range_min: 900, range_max: 999.99, fee: 325 },
  { range_min: 1000, range_max: 1199.99, fee: 465 },
  { range_min: 1200, range_max: 1299.99, fee: 485 },
  { range_min: 1300, range_max: 1399.99, fee: 500 },
  { range_min: 1400, range_max: 1499.99, fee: 515 },
  { range_min: 1500, range_max: 1599.99, fee: 540 },
  { range_min: 1600, range_max: 1699.99, fee: 555 },
  { range_min: 1700, range_max: 1799.99, fee: 575 },
  { range_min: 1800, range_max: 1999.99, fee: 595 },
  { range_min: 2000, range_max: 2399.99, fee: 630 },
  { range_min: 2400, range_max: 2499.99, fee: 665 },
  { range_min: 2500, range_max: 2999.99, fee: 700 },
  { range_min: 3000, range_max: 3499.99, fee: 745 },
  { range_min: 3500, range_max: 3999.99, fee: 795 },
  { range_min: 4000, range_max: 4499.99, fee: 855 },
  { range_min: 4500, range_max: 4999.99, fee: 880 },
  { range_min: 5000, range_max: 5499.99, fee: 905 },
  { range_min: 5500, range_max: 5999.99, fee: 930 },
  { range_min: 6000, range_max: 6499.99, fee: 975 },
  { range_min: 6500, range_max: 6999.99, fee: 995 },
  { range_min: 7000, range_max: 7499.99, fee: 1030 },
  { range_min: 7500, range_max: 7999.99, fee: 1050 },
  { range_min: 8000, range_max: 8499.99, fee: 1090 },
  { range_min: 8500, range_max: 8999.99, fee: 1110 },
  { range_min: 9000, range_max: 9999.99, fee: 1140 },
  { range_min: 10000, range_max: 10499.99, fee: 1165 },
  { range_min: 10500, range_max: 10999.99, fee: 1190 },
  { range_min: 11000, range_max: 11499.99, fee: 1195 },
  { range_min: 11500, range_max: 11999.99, fee: 1205 },
  { range_min: 12000, range_max: 12499.99, fee: 1250 },
  { range_min: 12500, range_max: 14999.99, fee: 1 },
  { range_min: 15000, range_max: null, fee_type: "percentage", fee: 12.25 },
];

export function calculateAuctionFee(amount: number, auction: AuctionProvider) {
  if (!Number.isFinite(amount) || amount <= 0) return 0;

  const tiers = auction === "copart" ? copartFee : iaaiFee;
  const tier = tiers.find(
    (item) => amount >= item.range_min && (item.range_max === null || amount <= item.range_max),
  );

  if (!tier) return 0;
  return tier.fee_type === "percentage" ? (amount * tier.fee) / 100 : tier.fee;
}

export function calculateImportTotal(params: {
  bid: number;
  auction: AuctionProvider;
  tariff: LocationTariff | null;
}): CalculationResult {
  const carPrice = Number.isFinite(params.bid) && params.bid > 0 ? params.bid : 0;
  const auctionFee = calculateAuctionFee(carPrice, params.auction);
  const baseTransport = params.tariff?.transportPrice ?? 0;
  // Cars over $12,000 carry a 1% surcharge on transportation (1% of car price).
  const transportSurcharge = carPrice > 12000 ? carPrice * 0.01 : 0;
  const transportTotal = baseTransport + transportSurcharge;

  return {
    carPrice,
    auctionFee,
    transportTotal,
    total: carPrice + auctionFee + transportTotal,
  };
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
