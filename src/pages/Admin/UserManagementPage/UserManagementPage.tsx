import { useState } from "react";
import styles from "./UserManagementPage.module.scss";
import { getUsersFromStorage } from "../../../utils/userStorage";
import type { User } from "../../../types/User";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>(() => getUsersFromStorage());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleBlockToggle = (
    userId: string,
    currentStatus: "active" | "blocked"
  ) => {
    const newStatus: "active" | "blocked" =
      currentStatus === "active" ? "blocked" : "active";
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, status: newStatus } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem("velocity_users", JSON.stringify(updatedUsers));
  };

  const openEditModal = (user: User) => {
    setEditingUser({ ...user }); // Create a copy so we don't mutate state directly
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    // Save changes
    const updatedUsers = users.map((u) =>
      u.id === editingUser.id ? editingUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem("velocity_users", JSON.stringify(updatedUsers));
    setIsModalOpen(false);
    setEditingUser(null);
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
                    onClick={() => openEditModal(user)}
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

      {/* --- EDIT MODAL --- */}
      {isModalOpen && editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit User</h2>
            <form onSubmit={handleSaveUser}>
              {/* Full Width Row */}
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  value={editingUser.fullName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, fullName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Mobile: Stacked | Desktop: Side-by-Side */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                    placeholder="+48..."
                  />
                </div>
              </div>

              {/* Mobile: Stacked | Desktop: Side-by-Side */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as "admin" | "client",
                      })
                    }
                  >
                    <option value="client">Client</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>City</label>
                  <select
                    value={editingUser.city}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        city: e.target.value as
                          | "Warsaw"
                          | "Gdansk"
                          | "Poznan"
                          | "Wroclaw",
                      })
                    }
                  >
                    <option value="Warsaw">Warsaw</option>
                    <option value="Gdansk">Gdansk</option>
                    <option value="Poznan">Poznan</option>
                    <option value="Wroclaw">Wroclaw</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
