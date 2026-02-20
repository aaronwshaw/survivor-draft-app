import LegacyBootstrap from "./legacy-bootstrap";

export default function Home() {
  return (
    <>
      <header className="app-header main-header">
        <h1>Survivor Team Draft</h1>
        <div className="header-actions auth-actions">
          <span id="currentUserLabel" className="muted" />
          <button id="logoutButton" className="secondary" type="button">
            Logout
          </button>
        </div>
      </header>

      <main className="app-shell">
        <section id="loginView" className="page-view" aria-labelledby="loginTitle">
          <img className="landing-top-banner" src="/photos/50logo.png" alt="Survivor 50 banner" />
          <div className="landing-hero card">
            <h2 id="loginTitle">Welcome to the Survivor Fantasy Draft</h2>
            <p className="muted">Log in or create an account with your username and password.</p>
            <div className="landing-options">
              <button id="landingLoginOption" type="button">
                Login
              </button>
              <button id="landingCreateOption" type="button" className="secondary">
                Create Account
              </button>
            </div>
          </div>
          <form id="authForm" className="card form-grid landing-auth-form">
            <label>
              Username
              <input id="authUsername" type="text" required placeholder="your-username" />
            </label>
            <label>
              Password
              <input id="authPassword" type="password" required placeholder="Enter password" />
            </label>
            <label>
              Display Name (for create account)
              <input id="authDisplayName" type="text" placeholder="Your name" />
            </label>
            <div className="button-row">
              <button id="signInButton" type="submit">
                Login
              </button>
              <button id="signUpButton" type="button" className="secondary">
                Create Account
              </button>
            </div>
          </form>
          <p id="loginMessage" className="message" />
          <img className="landing-cast" src="/photos/50cast.png" alt="Survivor 50 cast" />
        </section>

        <section id="leaguesView" className="page-view view-hidden" aria-labelledby="leaguesTitle">
          <h2 id="leaguesTitle">Your Leagues</h2>
          <div className="leagues-grid">
            <section className="card">
              <h3>Memberships</h3>
              <div id="leaguesList" className="leagues-list" />
            </section>

            <section className="card">
              <h3>Create League</h3>
              <form id="createLeagueForm" className="form-grid">
                <label>
                  League Name
                  <input id="createLeagueName" type="text" required placeholder="Family Survivor Pool" />
                </label>
                <button type="submit">Create League</button>
              </form>
            </section>

            <section className="card">
              <h3>Join League</h3>
              <form id="joinLeagueForm" className="form-grid">
                <label>
                  Invite Code
                  <input id="joinLeagueCode" type="text" required placeholder="ABC123" />
                </label>
                <button type="submit">Join League</button>
              </form>
            </section>
          </div>
          <p id="leaguesMessage" className="message" />
        </section>

        <section id="leagueView" className="page-view view-hidden" aria-labelledby="leagueTitle">
          <div className="league-topbar card">
            <div>
              <h2 id="leagueTitle" />
              <p id="leagueMeta" className="muted" />
              <p id="leagueInviteCode" className="muted" />
            </div>
            <div className="header-actions">
              <button id="backToLeaguesButton" className="secondary" type="button">
                Back to Leagues
              </button>
              <button id="teamAssignmentsButton" className="secondary view-hidden" type="button">
                Team Assignments
              </button>
              <div className="view-toggle">
                <button id="draftViewButton" className="secondary active-view" type="button">
                  Draft View
                </button>
                <button id="teamsViewButton" className="secondary" type="button">
                  Teams Photo View
                </button>
              </div>
              <button id="resetButton" className="danger-button" type="button">
                Reset League
              </button>
            </div>
          </div>

          <p id="leagueMessage" className="message" />

          <section id="teamAssignmentsView" className="card view-hidden" aria-labelledby="teamAssignmentsTitle">
            <h3 id="teamAssignmentsTitle">Team Assignments</h3>
            <p className="muted">Admins can reassign members between teams.</p>
            <div className="team-assignments-table-wrap">
              <table className="team-assignments-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Assigned Team</th>
                  </tr>
                </thead>
                <tbody id="teamAssignmentsTableBody" />
              </table>
            </div>
          </section>

          <div id="draftLayout" className="layout">
            <section className="teams-panel" aria-labelledby="teamsTitle">
              <h3 id="teamsTitle">Teams</h3>
              <div id="teamsContainer" className="teams-grid" />
            </section>

            <section className="pool-panel" aria-labelledby="playersTitle">
              <div className="panel-head">
                <h3 id="playersTitle">Player Pool</h3>
                <label className="inline-filter" htmlFor="draftFilterSelect">
                  Sort
                  <select id="draftFilterSelect">
                    <option value="alpha">Alphabetical</option>
                    <option value="season">First Season</option>
                  </select>
                </label>
              </div>
              <div id="playersContainer" className="players-grid" />
            </section>
          </div>

          <section id="teamsColumnsView" className="teams-columns-panel view-hidden" aria-labelledby="teamsColumnsTitle">
            <h3 id="teamsColumnsTitle">Teams Split View (8 Columns)</h3>
            <div className="teams-columns-scroll">
              <div id="teamColumnsContainer" className="team-columns-grid" />
            </div>
          </section>
        </section>
      </main>
      <footer className="app-footer">Created by Aaron Shaw</footer>

      <div id="assignModal" className="modal hidden" role="dialog" aria-modal="true" aria-labelledby="assignTitle">
        <div className="modal-card">
          <h3 id="assignTitle">Assign Player</h3>
          <p id="assignPlayerName" />
          <select id="assignSelect" />
          <div className="modal-actions">
            <button id="assignConfirm" type="button">
              Save
            </button>
            <button id="assignCancel" type="button" className="secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div id="detailsModal" className="modal hidden" role="dialog" aria-modal="true" aria-labelledby="detailsName">
        <div className="modal-card">
          <button id="detailsCloseTop" className="icon-close" type="button" aria-label="Close details">
            x
          </button>
          <img id="detailsPhoto" className="details-photo" alt="" />
          <h3 id="detailsName" />
          <p>
            <strong>Age:</strong> <span id="detailsAge" />
          </p>
          <p>
            <strong>Tribe:</strong> <span id="detailsTribe" />
          </p>
          <h4>Seasons</h4>
          <ul id="detailsSeasons" />
          <div className="modal-actions">
            <button id="detailsEliminateButton" type="button" className="danger-button">
              Eliminated
            </button>
            <button id="detailsCloseBottom" type="button" className="secondary">
              Close
            </button>
          </div>
        </div>
      </div>

      <LegacyBootstrap />
    </>
  );
}
