export default function Dashboard({ user, onLogout }) {
  return (
    <section className="auth-card dashboard" aria-labelledby="dashboard-title">
      <span className="eyebrow">Dashboard</span>
      <h1 id="dashboard-title">Welcome, {user.username}</h1>
      <p className="dashboard-intro">You are signed in to your account.</p>

      <div className="profile">
        <h2>Account details</h2>
        <dl>
          <div>
            <dt>Username</dt>
            <dd>{user.username}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>{user.address}</dd>
          </div>
        </dl>
      </div>

      <button className="secondary-button" type="button" onClick={onLogout}>
        Sign out
      </button>
    </section>
  );
}
