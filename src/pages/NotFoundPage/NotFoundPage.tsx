import { LandingPageLayout } from "../../components/LandingLayout/LandingPageLayout";
import styles from "./NotFoundPage.module.scss";

export default function NotFoundPage() {
  return (
    <LandingPageLayout>
      <div className={styles.errorContainer}>
        <h1 className={styles.errorCode}>404</h1>

        <div className={styles.messageBox}>
          <div className={styles.icon}>🚲💨</div>
          <h2>You've gone off-road!</h2>
          <p>
            The page you are looking for doesn't exist or has been moved to
            another garage.
          </p>
        </div>
      </div>
    </LandingPageLayout>
  );
}
