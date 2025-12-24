export const getRentalDays = (dates: { start: string; end: string }) => {
  if (!dates.start || !dates.end) return 0;

  const start = new Date(dates.start);
  const end = new Date(dates.end);

  // Calculate difference in milliseconds
  const diffTime = Math.abs(end.getTime() - start.getTime());

  // Convert to days and add 1 (to make it inclusive)
  // Example: Mon to Mon = 8 days, not 7
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const getDynamicPrice = (days: number) => {
  const BASE_RATE = 25; // Standard price per day in PLN
  let discount = 0;

  // Apply discounts based on duration
  if (days > 7 && days <= 14) {
    discount = 0.2; // 20% off
  } else if (days > 14 && days <= 21) {
    discount = 0.4; // 40% off
  }

  // Calculate final daily rate
  const dailyRate = Math.round(BASE_RATE * (1 - discount));

  return {
    dailyRate: dailyRate,
    total: dailyRate * days,

    // UI Helpers: Only show "Old Rate" if a discount was applied
    oldRate: discount > 0 ? BASE_RATE : null,
    discountLabel: discount > 0 ? `-${discount * 100}%` : null,
  };
};
