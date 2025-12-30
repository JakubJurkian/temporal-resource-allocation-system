import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import PageTransition from "../../../components/common/PageTransition";
import styles from "./PanelPage.module.scss";
import { getUserReservations } from "../../../utils/bookingHelper";
import { getModels } from "../../../utils/fleetStorage";
import {
  getMonthlyRevenue,
  getOccupancyRate,
  getPopularityStats,
} from "../../../utils/analyticsHelper";
import { getUsersFromStorage } from "../../../utils/userStorage";
import type { Reservation } from "../../../types/Reservation";
import type { BikeModel } from "../../../types/Fleet";

// Helper: robustly fetch reservations
const getAllReservations = (): Reservation[] => {
  const centralData = localStorage.getItem("velocity_reservations");
  if (centralData) {
    try {
      const parsed = JSON.parse(centralData);
      return Array.isArray(parsed) ? (parsed as Reservation[]) : [];
    } catch {
      return [];
    }
  }
  const users = getUsersFromStorage();
  return users.flatMap((u) => getUserReservations(u.id!));
};

const PanelPage = () => {
  // CORRECT APPROACH: Lazy Initialization
  // We pass a function to useState. React runs this ONCE during the initial render.
  // No useEffect, no re-renders, no cascading updates.
  const [dashboardData] = useState(() => {
    // 1. Load Data
    const reservations = getAllReservations();
    const models: BikeModel[] = getModels();

    // 2. Process Analytics
    const revenueChart = getMonthlyRevenue(reservations);
    const popularityChart = getPopularityStats(reservations, models);

    // 3. Calculate KPIs
    const totalRevenue = reservations.reduce(
      (sum, r) => (r.status !== "cancelled" ? sum + r.totalCost : sum),
      0
    );
    const occupancy = getOccupancyRate(reservations, models.length * 5);
    const active = reservations.filter((r) => r.status === "confirmed").length;

    // Return the initial state immediately
    return {
      revenueData: revenueChart,
      popularityData: popularityChart,
      kpi: {
        revenue: totalRevenue,
        occupancy: occupancy,
        activeRentals: active,
      },
    };
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <PageTransition>
      <div className={styles.panelPage}>
        <header className={styles.header}>
          <h1>Dashboard Overview</h1>
          <p>Real-time fleet analytics.</p>
        </header>

        {/* KPI CARDS */}
        <div className={styles.kpiGrid}>
          <div className={styles.card}>
            <h3>Total Revenue</h3>
            <div className={styles.value}>{dashboardData.kpi.revenue} PLN</div>
          </div>
          <div className={styles.card}>
            <h3>Occupancy Rate (Month)</h3>
            <div className={styles.value}>{dashboardData.kpi.occupancy}%</div>
            <div className={styles.subtext}>of total fleet capacity</div>
          </div>
          <div className={styles.card}>
            <h3>Active Rentals</h3>
            <div className={styles.value}>{dashboardData.kpi.activeRentals}</div>
          </div>
        </div>

        {/* CHARTS GRID */}
        <div className={styles.chartsGrid}>
          {/* CHART 1: REVENUE */}
          <div className={styles.chartCard} style={{ minWidth: 0 }}>
            <h3>Revenue Trend</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="name" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a2e",
                      borderColor: "#333",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="revenue" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 2: POPULARITY */}
          <div className={styles.chartCard} style={{ minWidth: 0 }}>
            <h3>Model Popularity</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.popularityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {dashboardData.popularityData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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
    </PageTransition>
  );
};

export default PanelPage;