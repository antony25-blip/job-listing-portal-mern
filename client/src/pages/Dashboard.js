import "../styles/dashboard.css";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="profile-card">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Phone:</b> Not added</p>
      </div>

      <div className="stats">
        <div>Saved Jobs: 5</div>
        <div>Applied Jobs: 3</div>
        <div>Interviews: 1</div>
      </div>
    </div>
  );
}
