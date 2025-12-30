import PageTransition from "../../components/common/PageTransition";
import styles from "./UnauthorizedPage.module.scss";

const UnauthorizedPage = () => {
  return (
    <PageTransition>
      <div className={styles.unauthorizedPage}>
        <h1>403 - Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    </PageTransition>
  );
};

export default UnauthorizedPage;
