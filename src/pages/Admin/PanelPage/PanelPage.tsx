import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import styles from "./Panelpage.module.scss";
import { getUserReservations } from "../../../utils/bookingHelper"; // Assuming you have a getAllReservations
import { getModels } from "../../../utils/fleetStorage";
import { getMonthlyRevenue, getOccupancyRate, getPopularityStats } from "../../../utils/analyticsHelper";
import { getUsersFromStorage } from "../../../utils/userStorage";

// Mocking "All Reservations" if you don't have a specific helper for it yet
// In a real app, you'd fetch ALL reservations, not just one user's.
const getAllReservations = () => {
  const users = getUsersFromStorage();
  // Flatten all users' reservations into one big array
  // This demonstrates "Array.flatMap" or "reduce"
  const allRes = users.flatMap(u => getUserReservations(u.id)); 
  return allRes;
};

const PanelPage = () => {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [popularityData, setPopularityData] = useState<any[]>([]);
  const [kpi, setKpi] = useState({ revenue: 0, occupancy: 0, activeRentals: 0 });

  useEffect(() => {
    // 1. Load Raw Data
    const reservations = getAllReservations();
    const models = getModels();

    // 2. Process Data (The "Analytic Module" requirement)
    const revenueChart = getMonthlyRevenue(reservations);
    const popularityChart = getPopularityStats(reservations, models);
    
    // 3. Calculate KPIs
    const totalRevenue = reservations.reduce((sum, r) => r.status !== 'cancelled' ? sum + r.totalCost : sum, 0);
    const occupancy = getOccupancyRate(reservations, models.length * 5); // Assuming 5 bikes per model
    const active = reservations.filter(r => r.status === 'confirmed').length;

    // 4. Set State
    setRevenueData(revenueChart);
    setPopularityData(popularityChart);
    setKpi({ revenue: totalRevenue, occupancy, activeRentals: active });
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Dashboard Overview</h1>
        <p>Real-time fleet analytics.</p>
      </header>

      {/* KPI CARDS */}
      <div className={styles.kpiGrid}>
        <div className={styles.card}>
          <h3>Total Revenue</h3>
          <div className={styles.value}>{kpi.revenue} PLN</div>
        </div>
        <div className={styles.card}>
          <h3>Occupancy Rate (Month)</h3>
          <div className={styles.value}>{kpi.occupancy}%</div>
          <div className={styles.subtext}>of total fleet capacity</div>
        </div>
        <div className={styles.card}>
          <h3>Active Rentals</h3>
          <div className={styles.value}>{kpi.activeRentals}</div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className={styles.chartsGrid}>
        
        {/* CHART 1: Monthly Revenue */}
        <div className={styles.chartCard}>
          <h3>Revenue Trend</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="revenue" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Bike Popularity */}
        <div className={styles.chartCard}>
          <h3>Model Popularity</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={popularityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {popularityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelPage;