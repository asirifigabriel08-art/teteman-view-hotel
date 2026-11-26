/* Teteman View Hotel — site behaviour. Content comes from data.js */
(() => {
  const T = window.TETEMAN, ICONS = window.ICONS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wa = (m) => `https://wa.me/${T.whatsapp}?text=${encodeURIComponent(m)}`;
  const ico = (n) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
  const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(T.plusCode)}`;
  const DIRS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(T.plusCode)}`;
  const NAV = [["Home", "index.html"], ["The Hotel", "about.html"], ["Rooms", "rooms.html"], ["Restaurant", "dining.html"], ["Gallery", "gallery.html"], ["Location", "contact.html"], ["Contact", "contact.html"]];
  const here = location.pathname.split("/").pop() || "index.html";
  const inRoomsFolder = /\/rooms\/[^/]+\.html/i.test(location.pathname);
  const base = inRoomsFolder ? "../" : "";
  document.documentElement.classList.add("js");

  /* Logo with fallbacks: light logo -> dark logo (inverted) -> text wordmark */
  function bindLogo(brand, wantsLight) {
    const img = $("img", brand);
    let lightMissing = false;
    const paint = () => {
      if (brand.classList.contains("no-logo")) return;
      const light = wantsLight();
      img.classList.toggle("invert", light && lightMissing);
      const want = base + (light && !lightMissing ? T.logo.light : T.logo.dark);
      if (!img.src.endsWith(want)) img.src = want;
    };
    img.addEventListener("error", () => {
      if (img.src.endsWith(T.logo.light)) { lightMissing = true; paint(); }
      else brand.classList.add("no-logo");
    });
    paint();
    return paint;
  }

  /* Header + footer + floating contact buttons */
  function chrome() {
    const hasBook = !!$("#book");
    const header = $("#site-header");
    header.innerHTML = `<div class="nav__in">
      <a class="brand" href="${base}index.html" aria-label="${T.name} home"><img alt="${T.name}" height="46"><span class="brand__txt">${T.name}</span></a>
      <a class="nav__mobile-book" href="${hasBook ? "#book" : base + "index.html#book"}">Book</a>
      <button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span></button>
      <nav class="menu" id="menu" aria-label="Main">${NAV.map(([n, h]) => `<a href="${base}${h}"${h === here ? ' aria-current="page"' : ""}>${n}</a>`).join("")}
      <a class="btn btn--primary" href="${hasBook ? "#book" : base + "index.html#book"}">Book your stay</a></nav></div>`;
    header.classList.add("nav");
    const paint = bindLogo($(".brand", header), () => !header.classList.contains("is-solid"));
    const onScroll = () => { header.classList.toggle("is-solid", scrollY > 40); paint(); };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();

    const burger = $(".burger", header);
    const toggle = (open) => {
      header.classList.toggle("open", open);
      document.body.classList.toggle("no-scroll", open);
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    burger.addEventListener("click", () => toggle(!header.classList.contains("open")));
    $$("a", $("#menu")).forEach((a) => a.addEventListener("click", () => toggle(false)));
    addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });

    const foot = $("#site-footer");
    foot.innerHTML = `<div class="wrap"><div class="foot__grid">
      <div><a class="brand" href="${base}index.html"><img alt="${T.name}" height="56"><span class="brand__txt">${T.name}</span></a>
        <p class="foot__tag">${T.tagline}</p><a class="btn btn--primary" href="${base}index.html#book">Book your stay</a></div>
      <div><h2>Explore</h2><ul>${NAV.slice(1).map(([n, h]) => `<li><a href="${base}${h}">${n}</a></li>`).join("")}</ul></div>
      <div><h2>Contact</h2><ul>
        <li><a href="tel:+233245467920">${T.phone}</a></li>
        <li><a data-wa="Hello ${T.name}, I'd like to make an enquiry.">Chat on WhatsApp</a></li>
        <li>Accra, Ghana</li><li><a href="${DIRS}" target="_blank" rel="noopener">Get directions</a></li></ul></div>
      <div><h2>Location</h2><ul><li>${T.plusCode}</li></ul></div></div>
      <div class="foot__bar"><span>© 2026 ${T.name}. All rights reserved.</span><span>Website by COMGAB DIGITAL</span></div></div>`;
    bindLogo($(".brand", foot), () => true);

    const float = document.createElement("div");
    float.innerHTML = `<a class="wa-float" data-wa="Hello ${T.name}, I'd like to make an enquiry." aria-label="Chat on WhatsApp">${ico("whatsapp")}</a>
      <div class="mbar"><a href="${hasBook ? "#book" : base + "index.html#book"}">${ico("calendar")} Book</a><a href="tel:+233245467920">${ico("phone")} Call</a><a data-wa="Hello ${T.name}, I'd like to make an enquiry.">${ico("whatsapp")} WhatsApp</a></div>`;
    document.body.append(...float.children);
  }

  /* Data-driven sections */
  function render() {
    $$("[data-rooms]").forEach((el) => {
      const list = el.dataset.rooms === "list";
      if (!list) {
        el.className = "room-showcase";
        el.innerHTML = `<div class="room-showcase__tabs" role="tablist" aria-label="Choose a room">${T.rooms.map((r, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-room="${r.id}" class="${i === 0 ? "is-active" : ""}"><span>0${i + 1}</span>${r.name}</button>`).join("")}</div>
          <article class="room-showcase__stage"><div class="room-showcase__image media" data-src="${T.rooms[0].img}" data-alt="${T.rooms[0].name} at ${T.name}" data-eager></div>
          <div class="room-showcase__copy"><p class="kicker" id="room-category">The essential stay</p><h3 id="room-name">${T.rooms[0].name}</h3><p id="room-blurb">${T.rooms[0].blurb}</p>
          <ul class="room-showcase__facts"><li>Flat-screen television</li><li>Free Wi-Fi</li><li>Private bathroom</li><li>Air conditioning</li></ul>
          <div class="row"><a class="btn btn--primary" id="room-explore" href="rooms/economy.html">Explore room</a><a class="room__book" id="room-wa" data-wa="Hello ${T.name}, I'd like to enquire about the Economy Room (GH₵250/night).">Request a stay <span>→</span></a></div></div></article>`;
        const tabs = $$(".room-showcase__tabs [data-room]", el);
        tabs.forEach((tab) => tab.addEventListener("click", () => {
          const room = T.rooms.find((r) => r.id === tab.dataset.room);
          if (!room) return;
          tabs.forEach((item) => { item.classList.remove("is-active"); item.setAttribute("aria-selected", "false"); });
          tab.classList.add("is-active"); tab.setAttribute("aria-selected", "true");
          const image = $(".room-showcase__image", el);
          image.classList.remove("is-ph"); image.dataset.src = room.img; image.dataset.alt = `${room.name} at ${T.name}`;
          image.style.backgroundImage = "";
          const im = new Image();
          im.onload = () => { image.style.backgroundImage = `url("${room.img}")`; };
          im.src = room.img;
          $("#room-name", el).textContent = room.name;
          $("#room-blurb", el).textContent = room.blurb;
          $("#room-category", el).textContent = room.id === "economy" ? "The essential stay" : room.id === "standard" ? "A little more room" : "The elevated choice";
          $("#room-explore", el).href = `rooms/${room.id}.html`;
          const waLink = $("#room-wa", el);
          waLink.dataset.wa = `Hello ${T.name}, I'd like to enquire about the ${room.name} (GH₵${room.price}/night).`;
          waLink.href = wa(waLink.dataset.wa); waLink.target = "_blank"; waLink.rel = "noopener";
        }));
        return;
      }
      el.innerHTML = T.rooms.map((r, i) =>
        `<article class="split room-row ${i % 2 ? "split--rev" : ""}" id="${r.id}">
            <div class="split__media reveal"><div class="room-frame frame"><div class="media" data-src="${r.img}" data-alt="${r.name} at ${T.name}"></div><span class="room-frame__index">0${i + 1}</span></div>
              ${r.gallery ? `<div class="room-thumbs">${r.gallery.map((src, n) => `<button class="g-item room-thumb" data-cat="${r.id}" data-src="${src}" data-alt="${r.name} photograph ${n + 1}" aria-label="Open ${r.name} photograph ${n + 1}"><div class="media" data-src="${src}" data-alt="${r.name} photograph ${n + 1}"></div></button>`).join("")}</div>` : ""}</div>
            <div class="split__txt reveal"><p class="kicker">Room 0${i + 1}</p><h2>${r.name}</h2><p class="room__price">GH₵${r.price} <small>per night</small></p><p>${r.blurb}</p>
              <ul class="detail">${r.details.map((d) => `<li>${d}</li>`).join("")}</ul>
              <div class="row"><a class="btn btn--primary" href="${base}rooms/${r.id}.html">View room</a><a class="btn btn--primary" href="#book">Book your stay</a><a class="btn btn--ghost" data-wa="Hello ${T.name}, I'd like to ask about the ${r.name} (GH₵${r.price}/night).">${ico("whatsapp")} Ask about this room</a></div></div></article>`).join("");
    });

    $$("[data-amenities]").forEach((el) => {
      const full = el.dataset.amenities === "full";
      el.className = "amen" + (full ? " amen--light" : "");
      el.innerHTML = T.amenities.map((a) => `<div class="amen__i">${ico(a.icon)}<h3>${a.name}</h3>${full ? `<p>${a.text}</p>` : ""}</div>`).join("");
    });

    $$("[data-reviews]").forEach((el) => {
      el.innerHTML = `<div class="note"><p class="kicker">Guest reviews</p><p>Guest reviews are not published here until verified review content is provided.</p></div>`;
    });

    $$("[data-gallery]").forEach((el) => {
      const preview = el.dataset.gallery === "preview";
      const items = preview ? [T.gallery[0], T.gallery[1], T.gallery.find((g) => g.cat === "reception") || T.gallery[2]].filter(Boolean) : T.gallery;
      el.innerHTML = items.map((g) => `<button class="g-item reveal ${preview ? "" : "a-" + g.shape}" data-cat="${g.cat}" data-src="${g.src}" data-alt="${g.alt}" aria-label="Open image: ${g.alt}"><div class="media" data-src="${g.src}" data-alt="${g.alt}"></div></button>`).join("");
    });

    $$("[data-wa]").forEach((a) => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-call]").forEach((a) => { a.href = "tel:+233245467920"; });
    $$("[data-dirs]").forEach((a) => { a.href = DIRS; a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-maps]").forEach((a) => { a.href = MAPS; a.target = "_blank"; a.rel = "noopener"; });
  }

  /* Images: load with placeholder fallback; lazy except hero */
  function media() {
    const load = (el) => {
      const s = el.dataset.src, im = new Image();
      el.setAttribute("role", "img"); el.setAttribute("aria-label", el.dataset.alt || "");
      im.onload = () => { el.style.backgroundImage = `url("${s}")`; };
      im.onerror = () => el.classList.add("is-ph");
      im.src = s;
    };
    const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { load(e.target); io.unobserve(e.target); } }), { rootMargin: "300px" }) : null;
    $$(".media[data-src]").forEach((el) => (el.hasAttribute("data-eager") || !io ? load(el) : io.observe(el)));
  }

  function reveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) return els.forEach((e) => e.classList.add("in"));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  function roomDetail() {
    const id = document.body.dataset.roomDetail;
    const mount = $("#room-detail");
    if (!id || !mount) return;
    const room = T.rooms.find((item) => item.id === id);
    if (!room) return;
    const prefixed = (src) => base + src;
    mount.innerHTML = `<section class="room-detail-hero"><div class="media" data-src="${prefixed(room.img)}" data-alt="${room.name} at ${T.name}" data-eager></div>
      <div class="room-detail-hero__copy"><p class="kicker">${T.name}</p><h1>${room.name}</h1><p class="room-detail-price">GH₵${room.price} <small>per night</small></p></div></section>
      <section class="sec"><div class="wrap room-detail-layout"><div class="room-detail-intro reveal"><p class="kicker">A comfortable space</p><h2>${room.blurb}</h2><p>Request this room directly and the hotel team can confirm availability for your stay.</p></div>
      <aside class="room-detail-facilities reveal"><p class="kicker">Room facilities</p><ul>${room.details.map((detail) => `<li>${detail}</li>`).join("")}</ul></aside></div></section>
      <section class="sec sec--sand"><div class="wrap"><div class="head"><div><p class="kicker">Gallery</p><h2>Look around the room</h2></div></div><div class="room-detail-gallery">${(room.gallery || [room.img]).map((src, index) => `<button class="g-item reveal" data-src="${prefixed(src)}" data-alt="${room.name} photograph ${index + 1}" aria-label="Open ${room.name} photograph ${index + 1}"><div class="media" data-src="${prefixed(src)}" data-alt="${room.name} photograph ${index + 1}"></div></button>`).join("")}</div></div></section>
      <section class="room-detail-cta sec sec--dark"><div class="wrap"><p class="kicker">Ready to make it your stay?</p><h2>Request ${room.name}</h2><div class="row"><a class="btn btn--primary" href="${base}index.html?room=${room.id}#book">Book this room</a><a class="btn btn--ghost" data-wa="Hello ${T.name}, I would like to enquire about the ${room.name} for my stay.">Ask about this room</a></div></div></section>`;
    $$("[data-wa]", mount).forEach((link) => { link.href = wa(link.dataset.wa); link.target = "_blank"; link.rel = "noopener"; });
  }

  function heroSlider() {
    const slides = $$(".hero__slide");
    const dots = $$(".hero__dot");
    const name = $(".hero__slide-name");
    const number = $(".hero__slide-number");
    if (!slides.length) return;
    const names = ["The Arrival", "The Exterior", "The Welcome", "Your Room", "Around the Table"];
    let current = 0;
    let timer = null;
    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === current);
        dot.setAttribute("aria-current", i === current ? "true" : "false");
      });
      if (number) number.textContent = `0${current + 1}`;
      if (name) name.textContent = names[current];
    };
    const start = () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      clearInterval(timer);
      timer = setInterval(() => show(current + 1), 6500);
    };
    dots.forEach((dot) => dot.addEventListener("click", () => { show(Number(dot.dataset.slide)); start(); }));
    document.addEventListener("visibilitychange", () => document.hidden ? clearInterval(timer) : start());
    show(0);
    start();
  }

  /* Enquiry forms: build a WhatsApp message, never "confirm" a booking */
  function forms() {
    const fmt = (d) => d ? new Date(d + "T00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-";
    const roomOpts = T.rooms.map((r) => `<option value="${r.id}">${r.name} - GH₵${r.price} per night</option>`).join("");
    const f = (id, label, ctl, full) => `<div class="field${full ? " field--full" : ""}"><label for="${id}">${label}</label>${ctl}</div>`;
    const today = new Date().toISOString().slice(0, 10);
    $$("[data-form]").forEach((box) => {
      const booking = box.dataset.form === "booking";
      box.innerHTML = `<form class="form" novalidate>
        ${booking ? f("room", "Room type", `<select id="room" name="room" required><option value="">Choose a room</option>${roomOpts}</select>`, true)
          + f("in", "Check-in", `<input id="in" name="in" type="date" min="${today}" required>`)
          + f("out", "Check-out", `<input id="out" name="out" type="date" min="${today}" required>`)
          + f("guests", "Number of guests", `<select id="guests" name="guests">${[1,2,3,4,5,6,7,8].map((n) => `<option value="${n}">${n}</option>`).join("")}</select>`)
          : f("room", "Enquiry", `<select id="room" name="room" required><option value="">Choose a room or service</option>${roomOpts}<option value="dining">Restaurant</option><option value="reception">Reception</option><option value="other">Something else</option></select>`)}
        ${f("name", "Full name", `<input id="name" name="name" autocomplete="name" required>`)}
        ${f("phone", "Phone number", `<input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required>`)}
        ${booking ? f("email", "Email address (optional)", `<input id="email" name="email" type="email" autocomplete="email">`) : ""}
        ${box.dataset.form === "contact" ? f("subject", "Subject", `<input id="subject" name="subject" autocomplete="off">`, true) : ""}
        ${f("msg", booking ? "Special requests" : "Message (optional)", `<textarea id="msg" name="msg" rows="3"></textarea>`, true)}
        ${booking ? `<div class="field field--full booking-summary"><strong>Estimated total</strong><span id="booking-total">Choose a room and valid dates</span></div>` : ""}
        <p class="form__note">This is a reservation request, not a confirmed reservation or payment. The hotel will confirm availability.</p>
        <button class="btn btn--primary" type="submit">${ico("whatsapp")} ${booking ? "Send booking enquiry" : "Send enquiry"}</button>
        <p class="form__status" role="status" aria-live="polite"></p></form>`;
      const form = $("form", box), status = $(".form__status", box);
      const outEl = $("#out", box), inEl = $("#in", box);
      const roomEl = $("#room", box), totalEl = $("#booking-total", box);
      const updateTotal = () => {
        if (!booking || !totalEl) return;
        const room = T.rooms.find((r) => r.id === roomEl.value);
        const nights = inEl.value && outEl.value && outEl.value > inEl.value
          ? Math.round((new Date(outEl.value + "T00:00") - new Date(inEl.value + "T00:00")) / 86400000) : 0;
        totalEl.textContent = room && nights > 0
          ? `${nights} night${nights === 1 ? "" : "s"} at GH₵${room.price} = GH₵${nights * room.price}`
          : "Choose a room and valid dates";
      };
      if (booking && roomEl) {
        const requestedRoom = new URLSearchParams(location.search).get("room");
        if (requestedRoom && [...roomEl.options].some((option) => option.value === requestedRoom)) {
          roomEl.value = requestedRoom;
          updateTotal();
        }
      }
      if (outEl) inEl.addEventListener("change", () => {
        outEl.min = inEl.value || today;
        if (outEl.value && outEl.value <= inEl.value) outEl.value = "";
        updateTotal();
      });
      if (outEl) outEl.addEventListener("change", updateTotal);
      if (roomEl) roomEl.addEventListener("change", updateTotal);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(form));
        status.classList.remove("err");
        const bad = [["room", booking ? "a room type" : "a room or service"], ["name", "your name"], ["phone", "your phone number"]].find(([k]) => !String(d[k] || "").trim())
          || (booking && !d.in ? ["in", "a check-in date"] : null) || (booking && !d.out ? ["out", "a check-out date"] : null);
        if (bad) { status.textContent = `Please add ${bad[1]}.`; status.classList.add("err"); $("#" + bad[0], box).focus(); return; }
        if (booking && d.in < today) { status.textContent = "Check-in cannot be a past date."; status.classList.add("err"); inEl.focus(); return; }
        if (booking && d.out <= d.in) { status.textContent = "Check-out must be after check-in."; status.classList.add("err"); outEl.focus(); return; }
        if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
          status.textContent = "Please enter a valid email address."; status.classList.add("err"); $("#email", box).focus(); return;
        }
        let lines;
        if (booking) {
          const room = T.rooms.find((r) => r.id === d.room);
          const nights = Math.round((new Date(d.out + "T00:00") - new Date(d.in + "T00:00")) / 86400000);
          if (!room || nights < 1) { status.textContent = "Please choose a room and valid dates."; status.classList.add("err"); return; }
          lines = ["TETEMAN VIEW HOTEL — BOOKING REQUEST", "", "Hello Teteman View Hotel,", "I would like to make a reservation.", "",
            `Full name: ${d.name}`, `Phone number: ${d.phone}`, `Email: ${d.email || "Not provided"}`,
            `Room category: ${room.name}`, `Price per night: GH₵${room.price}`,
            `Check-in date: ${fmt(d.in)}`, `Check-out date: ${fmt(d.out)}`,
            `Number of nights: ${nights}`, `Number of guests: ${d.guests}`,
            `Estimated total: GH₵${nights * room.price}`,
            `Special requests: ${d.msg && d.msg.trim() ? d.msg.trim() : "None"}`,
            "", "Please confirm availability and my reservation request.", "Thank you."
          ];
        } else {
          lines = [`Hello ${T.name}, I'd like to make an enquiry.`, "", `Name: ${d.name}`, `Phone: ${d.phone}`, `Interested in: ${d.room}`];
          if (d.subject) lines.splice(4, 0, `Subject: ${d.subject}`);
          if (d.msg && d.msg.trim()) lines.push(`Message: ${d.msg.trim()}`);
        }
        const url = wa(lines.join("\n"));
        status.innerHTML = `Opening WhatsApp. If nothing happens, <a href="${url}" target="_blank" rel="noopener">tap here to send your enquiry</a>.`;
        window.open(url, "_blank", "noopener");
      });
    });
  }

  /* Gallery filters + lightbox */
  function gallery() {
    const chips = $$(".chip");
    chips.forEach((c) => c.addEventListener("click", () => {
      chips.forEach((x) => x.setAttribute("aria-pressed", x === c));
      $$(".g-item").forEach((g) => { g.hidden = c.dataset.cat !== "all" && g.dataset.cat !== c.dataset.cat; });
    }));
    const items = $$(".g-item");
    if (!items.length) return;
    const lb = document.createElement("div");
    lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML = `<button class="lb__x" aria-label="Close">×</button><button class="lb__prev" aria-label="Previous image">‹</button>
      <figure class="lb__fig"><img alt=""><figcaption></figcaption></figure><button class="lb__next" aria-label="Next image">›</button>`;
    document.body.append(lb);
    const fig = $(".lb__fig", lb), img = $("img", lb);
    let cur = 0, opener = null;
    const vis = () => items.filter((g) => !g.hidden);
    const show = (i) => {
      const v = vis(); cur = (i + v.length) % v.length; const g = v[cur];
      fig.classList.remove("ph"); fig.dataset.path = g.dataset.src;
      img.onerror = () => fig.classList.add("ph");
      img.src = g.dataset.src; img.alt = g.dataset.alt; $("figcaption", lb).textContent = g.dataset.alt;
    };
    const close = () => { lb.classList.remove("open"); document.body.classList.remove("no-scroll"); opener && opener.focus(); };
    items.forEach((g) => g.addEventListener("click", () => { opener = g; show(vis().indexOf(g)); lb.classList.add("open"); document.body.classList.add("no-scroll"); $(".lb__x", lb).focus(); }));
    $(".lb__x", lb).onclick = close;
    $(".lb__prev", lb).onclick = () => show(cur - 1);
    $(".lb__next", lb).onclick = () => show(cur + 1);
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1);
    });
  }

  chrome(); render(); roomDetail(); forms(); media(); reveal(); gallery(); heroSlider();
})();
