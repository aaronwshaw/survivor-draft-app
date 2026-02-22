import LegacyBootstrap from "./legacy-bootstrap";

export default function Home() {
  return (
    <>
      <header className="app-header main-header">
        <h1>Survivor Draft</h1>
        <button id="topMenuToggle" className="secondary top-menu-toggle" type="button" aria-label="Open menu">
          <span className="hamburger-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        <div id="topBarMenu" className="top-bar-menu">
          <div id="globalLeagueNav" className="header-actions view-hidden">
            <button id="backToLeaguesButton" className="secondary" type="button">
              Back to Leagues
            </button>
            <button id="draftOrderNavButton" className="secondary view-hidden" type="button">
              League Management
            </button>
            <button id="yourTeamViewButton" className="secondary" type="button">
              Your Team
            </button>
            <button id="survivorMgmtViewButton" className="secondary view-hidden" type="button">
              Survivor Management
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
          <div className="account-stack">
            <span id="currentUserLabel" className="muted" />
            <button id="logoutButton" className="secondary" type="button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-shell">
        <section id="loginView" className="page-view" aria-labelledby="loginTitle">
          <img className="landing-top-banner" src="/photos/50logo.png" alt="Survivor 50 banner" />
          <div className="landing-hero card">
            <h2 id="loginTitle">Welcome to the Survivor Fantasy Draft</h2>
            <p className="muted">Log in or create an account with your username and password.</p>
            <div className="landing-options">
              <button id="landingLoginOption" type="button" className="active-mode">
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
            <label id="authDisplayNameField" hidden>
              Display Name (for create account)
              <input id="authDisplayName" type="text" placeholder="Your name" />
            </label>
            <div className="button-row">
              <button id="authSubmitButton" type="submit">
                Login
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
              <h3>Join League</h3>
              <form id="joinLeagueForm" className="form-grid">
                <label>
                  Invite Code
                  <input id="joinLeagueCode" type="text" required placeholder="ABC123" />
                </label>
                <button type="submit">Join League</button>
              </form>
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
          </div>
          <p id="leaguesMessage" className="message" />
        </section>

        <section id="leagueView" className="page-view view-hidden" aria-labelledby="leagueTitle">
          <section id="turnBanner" className="turn-banner view-hidden" aria-live="polite">
            <span id="turnBannerText" />
          </section>
          <section id="turnPreview" className="turn-preview view-hidden" aria-live="polite">
            <h4>Next 5 Picks</h4>
            <ol id="turnPreviewList" />
          </section>

          <div id="leagueInfoCard" className="league-topbar card view-hidden">
            <div>
              <h2 id="leagueTitle" />
              <p id="leagueMeta" className="muted" />
              <div className="invite-row">
                <p id="leagueInviteCode" className="muted" />
                <button id="copyInviteCodeButton" type="button" className="secondary">
                  Copy Invite Code
                </button>
              </div>
            </div>
          </div>

          <section id="yourTeamView" className="card view-hidden" aria-label="Your team">
            <div className="your-team-edit">
              <h4 id="yourTeamNameDisplay" className="your-team-name" />
              <input id="yourTeamNameInput" type="text" className="view-hidden" />
              <div className="button-row">
                <button id="editTeamNameButton" type="button" className="secondary">
                  Edit Team Name
                </button>
                <button id="saveTeamNameButton" type="button" className="view-hidden">
                  Save Team Name
                </button>
              </div>
            </div>
            <p id="yourTeamMeta" className="muted" />
            <div id="yourTeamPlayers" className="players-grid" />
          </section>

          <section id="survivorManagementView" className="card view-hidden" aria-label="Survivor management">
            <h3>Survivor Management</h3>
            <p className="muted">Owner-only: manage tribes and elimination globally across all leagues.</p>
            <section className="tribe-management card">
              <h4>Tribe Management</h4>
              <div id="tribeManagementList" className="tribe-management-list" />
              <div className="tribe-management-create">
                <label>
                  New Tribe Name
                  <input id="newGlobalTribeName" type="text" placeholder="Create new tribe" />
                </label>
                <label>
                  Color
                  <select id="newGlobalTribeColor">
                    <option value="#e53935">Red</option>
                    <option value="#1e88e5">Blue</option>
                    <option value="#43a047">Green</option>
                    <option value="#fbc02d">Yellow</option>
                    <option value="#8e24aa">Purple</option>
                    <option value="#fb8c00">Orange</option>
                    <option value="#00897b">Teal</option>
                    <option value="#6d4c41">Brown</option>
                  </select>
                </label>
                <button id="createGlobalTribeButton" type="button" className="secondary">
                  Create Tribe
                </button>
              </div>
            </section>
            <h4>Players</h4>
            <div id="survivorPlayersGrid" className="players-grid" />
          </section>

          <p id="leagueMessage" className="message" />

          <div id="leagueManagementView" className="management-grid view-hidden">
            <section id="teamAssignmentsView" className="card" aria-labelledby="teamAssignmentsTitle">
              <h3 id="teamAssignmentsTitle">Team Assignments</h3>
              <p className="muted">Admins can reassign members between teams.</p>
              <p id="teamAssignmentsMessage" className="message team-assignments-message" />
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

            <section id="draftOrderView" className="card" aria-labelledby="draftAdminTitle">
              <h3 id="draftAdminTitle">Draft Order Management</h3>
              <p className="muted">Set the team order, randomize, and start a snake draft.</p>
              <div className="button-row">
                <button id="randomizeDraftOrderButton" type="button" className="secondary">
                  Randomize Order
                </button>
                <button id="startDraftButton" type="button">
                  Start Draft
                </button>
                <button id="stopDraftButton" type="button" className="danger-button view-hidden">
                  Stop Draft
                </button>
              </div>
              <div id="draftTurnStatus" className="message" />
              <div id="draftOrderList" className="draft-order-list" />
            </section>
          </div>

          <div id="draftLayout" className="layout">
            <section className="teams-panel" aria-labelledby="teamsTitle">
              <h3 id="teamsTitle">Teams</h3>
              <div id="teamsContainer" className="teams-grid" />
            </section>

            <section className="pool-panel" aria-labelledby="playersTitle">
              <div className="panel-head">
                <h3 id="playersTitle">Player Pool</h3>
                <div className="filters-inline">
                  <label className="inline-filter" htmlFor="draftFilterSelect">
                    Sort
                    <select id="draftFilterSelect">
                      <option value="alpha">Alphabetical</option>
                      <option value="season">First Season</option>
                    </select>
                  </label>
                  <label className="inline-filter" htmlFor="tribeFilterSelect">
                    Tribe
                    <select id="tribeFilterSelect">
                      <option value="all">All Tribes</option>
                    </select>
                  </label>
                </div>
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
          <div className="details-controls-row">
            <section id="tribeAssignSection" className="view-hidden">
              <button id="tribeAssignToggle" type="button" className="secondary">
                Tribe Assignment
              </button>
              <div id="tribeAssignPanel" className="tribe-assign-panel view-hidden">
                <div className="form-grid">
                  <label>
                    Existing Tribe
                    <select id="tribeSelect">
                      <option value="">None</option>
                    </select>
                  </label>
                  <button id="saveTribeButton" type="button" className="secondary">
                    Save Tribe
                  </button>
                </div>
              </div>
            </section>
            <div className="modal-actions">
              <button id="detailsEliminateButton" type="button" className="danger-button">
                Eliminated
              </button>
              <button id="detailsCloseBottom" type="button" className="secondary">
                Close
              </button>
            </div>
          </div>
          <p>
            <strong>Age:</strong> <span id="detailsAge" />
          </p>
          <p>
            <strong>Tribe:</strong> <span id="detailsTribe" />
          </p>
          <h4>Seasons</h4>
          <ul id="detailsSeasons" />
        </div>
      </div>

      <LegacyBootstrap />
    </>
  );
}
