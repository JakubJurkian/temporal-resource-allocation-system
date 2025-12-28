import styles from "./UnauthorizedPage.module.scss";

const UnauthorizedPage = () => {
  return (
    <div className={styles.content}>
      <h1>403 - Access Denied</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  );
};

export default UnauthorizedPage;
