import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  type View,
} from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import { differenceInCalendarDays } from "date-fns/differenceInCalendarDays";

import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./Calendar.module.scss";

// 1. SETUP LOCALIZER
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Helper: Format JS Date to "YYYY-MM-DD"
const formatForInput = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

// MOCK DATA (Hours set to 00:00:00 internally)
const INITIAL_RESERVATIONS = [
  {
    id: "r1",
    bikeName: "Speedster X",
    clientName: "Jan Kowalski",
    start: new Date(2025, 11, 28), // Dec 28
    end: new Date(2025, 11, 31), // Dec 31
    status: "confirmed",
  },
  {
    id: "r2",
    bikeName: "City Cruiser",
    clientName: "Anna Nowak",
    start: new Date(2025, 11, 25),
    end: new Date(2025, 11, 27),
    status: "completed",
  },
];

const AdminCalendar = () => {
  // --- STATE ---
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [dayCount, setDayCount] = useState(0); // Live counter for days

  // --- RESPONSIVENESS ---
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setView(Views.AGENDA);
      } else {
        setView((prev) => (prev === Views.AGENDA ? Views.MONTH : prev));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- HANDLERS ---

  const handleNavigate = useCallback((newDate: Date) => setDate(newDate), []);
  const handleViewChange = useCallback((newView: View) => setView(newView), []);

  // 1. Update day count whenever dates change in modal
  useEffect(() => {
    if (editingRes?.startStr && editingRes?.endStr) {
      const s = new Date(editingRes.startStr);
      const e = new Date(editingRes.endStr);
      // Calculate diff including the last day
      const diff = differenceInCalendarDays(e, s) + 1; // +1 because 28th to 28th is 1 rental day
      setDayCount(diff > 0 ? diff : 0);
    }
  }, [editingRes?.startStr, editingRes?.endStr]);

  // 2. Open Edit Modal
  const handleSelectEvent = (event: any) => {
    const resData = { ...event.resource };
    setErrorMsg("");
    setEditingRes({
      ...resData,
      startStr: formatForInput(resData.start),
      endStr: formatForInput(resData.end),
    });
    setIsModalOpen(true);
  };

  // 3. "End Now" -> Sets End Date to Today
  const handleEndNow = () => {
    if (!editingRes) return;
    const now = new Date();
    setEditingRes({
      ...editingRes,
      endStr: formatForInput(now),
      status: "completed",
    });
  };

  // 4. Save Changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRes) return;

    // Use 'parse' to ensure local time midnight, preventing timezone shift issues
    const newStart = parse(editingRes.startStr, "yyyy-MM-dd", new Date());
    const newEnd = parse(editingRes.endStr, "yyyy-MM-dd", new Date());

    // LOGIC: End date cannot be before Start date
    if (newEnd < newStart) {
      setErrorMsg("Data zwrotu nie może być wcześniejsza niż data odbioru.");
      return;
    }

    // LOGIC: Min 3 days Warning (Optional - Admin can override, so we just warn or block)
    /*
    const diff = differenceInCalendarDays(newEnd, newStart) + 1;
    if (diff < 3) {
      setErrorMsg("Rezerwacja musi trwać minimum 3 dni!");
      return;
    }
    */

    const updatedReservations = reservations.map((res) => {
      if (res.id === editingRes.id) {
        return {
          ...res,
          status: editingRes.status,
          start: newStart,
          end: newEnd,
        };
      }
      return res;
    });

    setReservations(updatedReservations);
    setIsModalOpen(false);
  };

  // --- DATA MAPPING ---
  const events = useMemo(() => {
    return reservations.map((res) => ({
      id: res.id,
      title: `${res.bikeName} - ${res.clientName}`,
      start: res.start,
      end: res.end,
      allDay: true, // <--- IMPORTANT: Forces solid bars in Month view
      resource: res,
    }));
  }, [reservations]);

  // --- STYLING ---
  const eventStyleGetter = (event: any) => {
    const status = event.resource.status;
    let backgroundColor = "#3174ad";

    if (status === "confirmed") backgroundColor = "#2e7d32";
    if (status === "completed") backgroundColor = "#616161";
    if (status === "cancelled") backgroundColor = "#c62828";

    return { style: { backgroundColor, fontSize: "0.85rem", border: "none" } };
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Harmonogram Floty</h1>
        <p>Edycja rezerwacji w trybie dziennym.</p>
      </header>

      <div className={styles.calendarWrapper}>
        <Calendar
          localizer={localizer}
          events={events}
          date={date}
          onNavigate={handleNavigate}
          view={view}
          onView={handleViewChange}
          views={[Views.MONTH, Views.AGENDA]}
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      </div>

      {/* --- EDIT MODAL --- */}
      {isModalOpen && editingRes && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edycja Rezerwacji</h2>

            <div className={styles.infoBox}>
              <p>
                <strong>Rower:</strong> {editingRes.bikeName}
              </p>
              <p>
                <strong>Klient:</strong> {editingRes.clientName}
              </p>
              {/* Dynamic Day Counter */}
              <p
                style={{
                  marginTop: "0.5rem",
                  fontWeight: "bold",
                  color: "#00E5FF",
                }}
              >
                Czas trwania: {dayCount} dni
                {dayCount < 3 && (
                  <span style={{ color: "#ff9800", fontWeight: "normal" }}>
                    {" "}
                    (Poniżej minimum 3)
                  </span>
                )}
              </p>
            </div>

            {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select
                  value={editingRes.status}
                  onChange={(e) =>
                    setEditingRes({ ...editingRes, status: e.target.value })
                  }
                >
                  <option value="confirmed">Potwierdzona</option>
                  <option value="completed">Zakończona</option>
                  <option value="cancelled">Anulowana</option>
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Data Odbioru</label>
                  {/* TYPE = DATE */}
                  <input
                    type="date"
                    value={editingRes.startStr}
                    onChange={(e) =>
                      setEditingRes({ ...editingRes, startStr: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    Data Zwrotu
                    <button
                      type="button"
                      onClick={handleEndNow}
                      className={styles.miniBtn}
                      title="Ustaw na dzisiaj"
                    >
                      Dzisiaj
                    </button>
                  </label>
                  {/* TYPE = DATE */}
                  <input
                    type="date"
                    value={editingRes.endStr}
                    onChange={(e) =>
                      setEditingRes({ ...editingRes, endStr: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Anuluj
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;
