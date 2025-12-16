import { Link } from "react-router-dom";
import styles from "./FleetPage.module.scss";

const FleetPage = () => {
  // Realistic mock data for FOOD DELIVERY context
  const bikes = [
    {
      id: 1,
      model: "Sprint Courier S1",
      category: "Agility",
      description: "The choice for city centers. Lightweight and agile enough to weave through traffic jams. Perfect for backpack delivery.",
      stats: { speed: 45, range: 80, capacity: 40 }, // High speed/agility, low cargo (backpack only)
      imageEmoji: "🛵",
    },
    {
      id: 2,
      model: "Endurance Pro 2.0",
      category: "Long-Shift",
      description: "Built for the 10-hour shift warrior. Dual-battery system ensures you never run out of juice during the dinner rush.",
      stats: { speed: 35, range: 100, capacity: 60 }, // Huge range, average speed
      imageEmoji: "🔋",
    },
    {
      id: 3,
      model: "Cargo King XL",
      category: "Heavy Duty",
      description: "Large grocery order? 10 Pizzas? No problem. Features a front insulated box and heavy-duty rear rack.",
      stats: { speed: 25, range: 60, capacity: 100 }, // Low speed, Max cargo
      imageEmoji: "🍕",
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.topBar}>
        <div className={styles.logo}>Velo<span className={styles.highlight}>City</span></div>
        <Link to="/" className={styles.backLink}>← Back Home</Link>
      </header>

      <main className={styles.content}>
        <div className={styles.header}>
          <h1>Delivery Fleet.</h1>
          <p>Reliable tools for professional couriers. Minimize downtime, maximize tips.</p>
        </div>

        <div className={styles.bikeList}>
          {bikes.map((bike) => (
            <article key={bike.id} className={styles.bikeCard}>
              {/* Visual Side */}
              <div className={styles.visual}>
                <div className={styles.categoryTag}>{bike.category}</div>
                <div className={styles.bikeImagePlaceholder}>{bike.imageEmoji}</div>
              </div>

              {/* Info Side */}
              <div className={styles.info}>
                <h2>{bike.model}</h2>
                <p className={styles.desc}>{bike.description}</p>
                
                <div className={styles.statsContainer}>
                  {/* Stat: Speed */}
                  <div className={styles.statRow}>
                    <span className={styles.label}>Speed</span>
                    <div className={styles.barTrack}>
                      {/* Scaled based on max speed approx 40km/h */}
                      <div className={styles.barFill} style={{width: `${(bike.stats.speed / 40) * 100}%`}}></div>
                    </div>
                    <span className={styles.value}>{bike.stats.speed} km/h</span>
                  </div>

                  {/* Stat: Range */}
                  <div className={styles.statRow}>
                    <span className={styles.label}>Range</span>
                    <div className={styles.barTrack}>
                      {/* Scaled based on max range approx 150km */}
                      <div className={styles.barFill} style={{width: `${(bike.stats.range / 100) * 100}%`}}></div>
                    </div>
                    <span className={styles.value}>{bike.stats.range} km</span>
                  </div>

                  {/* Stat: Capacity (Changed from Comfort) */}
                  <div className={styles.statRow}>
                    <span className={styles.label}>Capacity</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{width: `${bike.stats.capacity}%`}}></div>
                    </div>
                    <span className={styles.value}>{bike.stats.capacity}%</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FleetPage;