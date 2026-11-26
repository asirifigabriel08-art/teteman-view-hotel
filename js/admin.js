(() => {
  const cfg = window.TETEMAN_SUPABASE || {};
  const loginPanel = document.querySelector("#login-panel");
  const sidebar = document.querySelector("#sidebar");
  const dashboard = document.querySelector("#dashboard");
  const setupMessage = document.querySelector("#setup-message");
  const loginForm = document.querySelector("#login-form");
  const loginStatus = document.querySelector("#login-status");
  const dataView = document.querySelector("#data-view");
  const metrics = document.querySelector("#metrics");
  let supabase = null;

  const configured = cfg.url && cfg.anonKey && window.supabase;
  if (!configured) {
    loginStatus.textContent = "Dashboard unavailable until Supabase credentials are configured.";
    loginForm.querySelector("button").disabled = true;
  } else {
    supabase = window.supabase.createClient(cfg.url, cfg.anonKey);
  }

  async function showDashboard() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    loginPanel.hidden = true;
    sidebar.hidden = false;
    dashboard.hidden = false;
    await renderOverview();
  }

  document.querySelector("#login-form").onsubmit = async (event) => {
    event.preventDefault();
    if (!supabase) return;
    const email = document.querySelector("#login-email").value.trim();
    const password = document.querySelector("#login-password").value;
    loginStatus.textContent = "Signing in...";
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) loginStatus.textContent = error.message;
    else await showDashboard();
  };

  document.querySelector("#logout-button").addEventListener("click", async () => {
    if (supabase) await supabase.auth.signOut();
    location.reload();
  });

  async function renderOverview() {
    document.querySelector("#dashboard-title").textContent = "Overview";
    metrics.innerHTML = "<div class=\"metric\">Loading…</div>";
    const { data, error } = await supabase.from("bookings").select("status,check_in,check_out");
    if (error) {
      metrics.innerHTML = `<div class="metric">${error.message}</div>`;
      dataView.innerHTML = "";
      return;
    }
    const today = new Date().toISOString().slice(0,10);
    const values = [
      ["Total requests", data.length],
      ["Pending", data.filter(b => b.status === "pending").length],
      ["Confirmed", data.filter(b => b.status === "confirmed").length],
      ["Arrivals today", data.filter(b => b.check_in === today).length]
    ];
    metrics.innerHTML = values.map(([label,value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`).join("");
    await renderBookings();
  }

  async function renderBookings() {
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending:false });
    dataView.innerHTML = error ? `<p>${error.message}</p>` : `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Room</th><th>Dates</th><th>Total</th><th>Status</th></tr></thead><tbody>${(data||[]).map(b => `<tr><td>${escapeHtml(b.full_name)}</td><td>${escapeHtml(b.phone)}</td><td>${escapeHtml(b.room_category)}</td><td>${b.check_in} to ${b.check_out}</td><td>GH₵${b.estimated_total}</td><td>${escapeHtml(b.status)}</td></tr>`).join("")}</tbody></table></div>`;
  }

  async function renderRooms() {
    metrics.innerHTML = "";
    const { data, error } = await supabase.from("rooms").select("*").order("name");
    dataView.innerHTML = error ? `<p>${error.message}</p>` : `<form class="room-form" id="room-form">${(data||[]).map(r => `<label>${escapeHtml(r.name)}<input name="${r.id}" type="number" min="0" step="1" value="${r.price_per_night}"></label>`).join("")}<button type="submit">Save prices</button></form>`;
  }

  document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", async () => {
    document.querySelectorAll("[data-view]").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    const view = button.dataset.view;
    document.querySelector("#dashboard-title").textContent = view[0].toUpperCase() + view.slice(1);
    if (view === "overview") await renderOverview();
    if (view === "bookings") { metrics.innerHTML = ""; await renderBookings(); }
    if (view === "rooms") await renderRooms();
  }));

  document.addEventListener("submit", async event => {
    if (event.target.id !== "room-form") return;
    event.preventDefault();
    const updates = [...new FormData(event.target).entries()];
    for (const [id, price] of updates) {
      await supabase.from("rooms").update({ price_per_night: Number(price) }).eq("id", id);
    }
  });

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
  }

  showDashboard();
})();
