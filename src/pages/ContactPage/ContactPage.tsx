import { useEffect, useState } from "react";
import PageTransition from "../../components/common/PageTransition";
import styles from "./ContactPage.module.scss";

interface Icons {
  place: string;
  phone: string;
  mail: string;
}

const ContactPage = () => {
  const [icons, setIcons] = useState<Icons>({
    place: "??",
    phone: "??",
    mail: "??",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const res = await fetch("/data/icons.json");
        if (!res.ok) throw new Error("Failed to fetch icons");

        const data = await res.json();
        setIcons(data);
      } catch (err) {
        console.error("Icon fetch error: ", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIcons();
  }, []);

  return (
    <PageTransition>
      <div className={styles.contactPage}>
        <section className={styles.contactSection}>
          <h2>Get in Touch</h2>
          <p className={styles.contactSubtitle}>
            Have questions about the fleet or business partnerships?
          </p>

          <div className={styles.contactGrid}>
            {/* Address Card */}
            <div className={styles.contactCard}>
              <div
                className={`${styles.icon} ${isLoading ? styles.loading : ""}`}
              >
                {icons.place}
              </div>
              <h3>Visit HQ</h3>
              <p>
                ul. Marszałkowska 1
                <br />
                00-001 Warszawa, PL
              </p>
            </div>

            {/* Phone Card */}
            <div className={styles.contactCard}>
              <div
                className={`${styles.icon} ${isLoading ? styles.loading : ""}`}
              >
                {icons.phone}
              </div>
              <h3>Call Us</h3>
              <p>
                <a href="tel:+48123456789">+48 123 456 789</a>
                <br />
                <span className={styles.sub}>Mon-Fri, 9am - 5pm</span>
              </p>
            </div>

            {/* Email Card */}
            <div className={styles.contactCard}>
              <div
                className={`${styles.icon} ${isLoading ? styles.loading : ""}`}
              >
                {icons.mail}
              </div>
              <h3>Email Us</h3>
              <p>
                <a href="mailto:hello@velocity.com">hello@velocity.com</a>
                <br />
                <span className={styles.sub}>We reply within 24h</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default ContactPage;
