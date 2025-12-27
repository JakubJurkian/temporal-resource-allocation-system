export const processPayment = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Simulate Network Delay
    const delay = 2000;

    setTimeout(() => {
      // Simulate Random Success/Failure (80% chance of success)
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        resolve(true); // "Success"
      } else {
        reject(new Error("Insufficient funds")); // "Denied"
      }
    }, delay);
  });
};
