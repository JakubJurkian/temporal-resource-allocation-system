import styles from "../RentBikePage.module.scss";

interface Props {
  setStep: (s: 1 | 2 | 3 | 4 | 5) => void;
  onSubmit: (e: React.FormEvent) => void;
  paymentStatus: "idle" | "processing" | "success" | "error";
  price: number;
}

export default function StepPayment({
  setStep,
  onSubmit,
  paymentStatus,
  price,
}: Props) {
  return (
    <div className={styles.stepContainer}>
      <button
        onClick={() => setStep(4)}
        className={styles.backBtn}
        disabled={paymentStatus === "processing" || paymentStatus === "success"}
      >
        ← Back to Summary
      </button>

      <h1>Secure Checkout</h1>
      <p className={styles.subtitle}>Enter your card details to finalize.</p>

      <form onSubmit={onSubmit} className={styles.paymentForm}>
        {/* CARD UI */}
        <div className={styles.cardContainer}>
          <div className={styles.inputGroup}>
            <label>Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              required
              disabled={paymentStatus === "processing"}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Card Number</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              required
              disabled={paymentStatus === "processing"}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                required
                disabled={paymentStatus === "processing"}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>CVC</label>
              <input
                type="text"
                placeholder="123"
                maxLength={3}
                required
                disabled={paymentStatus === "processing"}
              />
            </div>
          </div>
        </div>

        {/* STATUS MESSAGES */}
        {paymentStatus === "error" && (
          <div className={styles.errorBanner}>
            ⚠️ Transaction declined. Bank rejected the operation.
          </div>
        )}

        {paymentStatus === "success" && (
          <div className={styles.successBanner}>
            ✅ Payment Successful! Redirecting...
          </div>
        )}

        {/* PAY BUTTON */}
        <button
          type="submit"
          className={styles.payBtn}
          disabled={
            paymentStatus === "processing" || paymentStatus === "success"
          }
        >
          {paymentStatus === "processing" ? (
            <span className={styles.miniSpinner}></span>
          ) : (
            `Pay ${price} PLN`
          )}
        </button>
      </form>
    </div>
  );
}
