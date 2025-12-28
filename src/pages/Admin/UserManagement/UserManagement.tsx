import { useState } from "react";
import styles from "./UserManagement.module.scss";
import { getUsersFromStorage } from "../../../utils/userStorage";
import type { User } from "../../../types/User";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>(() => getUsersFromStorage());

  const handleBlockToggle = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    // localStorage.setItem("velocity_users", JSON.stringify(users));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h1>User Management</h1>
          <p>View, edit, and manage system access.</p>
        </div>
        <button className={styles.primaryBtn}>+ Add New User</button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <select className={styles.select}>
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="client">Client</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th className={styles.alignRight}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className={styles.primaryCell}>
                  <div className={styles.userCell}>
                    <div className={styles.avatar}>
                      {user.fullName.charAt(0)}
                    </div>
                    <div className={styles.userInfo}>
                      <span className={styles.name}>{user.fullName}</span>
                      <span className={styles.email}>{user.email}</span>
                    </div>
                  </div>
                </td>
                <td data-label="Role">
                  <span
                    className={`${styles.roleTag} ${
                      user.role === "admin" ? styles.admin : styles.client
                    }`}
                  >
                    {user.role === "admin" ? "Administrator" : "Client"}
                  </span>
                </td>
                <td data-label="Status">
                  <span
                    className={`${styles.statusDot} ${
                      user.status === "active" ? styles.active : styles.blocked
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td data-label="Joined">
                  <span className={styles.dateText}>
                    {new Date(user.joinedDate).toLocaleDateString()}
                  </span>
                </td>

                {/* ACTIONS COLUMN */}
                <td className={styles.actionsCell}>
                  {/* Edit Button */}
                  <button
                    className={styles.actionBtn}
                    
                  >
                    Edit
                  </button>

                  {/* Block/Unblock Button */}
                  <button
                    className={`${styles.actionBtn} ${
                      user.status === "active" ? styles.danger : styles.success
                    }`}
                    onClick={() => handleBlockToggle(user.id!, user.status)}
                  >
                    {user.status === "active" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
