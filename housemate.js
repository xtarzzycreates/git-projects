(() => {
  "use strict";

  const STORAGE = {
    listings: "housemate-listings-v1",
    saved: "housemate-saved-v1",
    messages: "housemate-messages-v1",
    theme: "housemate-theme-v1",
    contactRequests: "housemate-contact-requests-v1",
    acceptedContacts: "housemate-accepted-contacts-v1",
    conversation: "housemate-conversation-v1"
  };
  const roomSeeds = [
    { id: "room-1", kind: "room", title: "Bright room in a calm home", location: "Wuse 2, Abuja", area: "Wuse 2", price: 420000, roomType: "2-bedroom flat", roomsNeeded: 1, available: "Available now", description: "A sunlit private room in a clean, friendly home. The flat is close to shops and public transport, with a shared kitchen and reliable water.", preferences: "Looking for a tidy, considerate working professional.", name: "Amara O.", age: 27, image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", posted: "2 days ago" },
    { id: "room-2", kind: "room", title: "Private room with a garden view", location: "Gwarinpa, Abuja", area: "Gwarinpa", price: 350000, roomType: "3-bedroom flat", roomsNeeded: 2, available: "Available 1 Nov", description: "Comfortable, unfurnished room in a spacious shared apartment. The estate is secure and has easy access to the expressway.", preferences: "Two respectful housemates who enjoy a peaceful home.", name: "Tunde A.", age: 31, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80", posted: "Yesterday" },
    { id: "room-3", kind: "room", title: "Easy-going home, great location", location: "Jabi, Abuja", area: "Jabi", price: 550000, roomType: "2-bedroom flat", roomsNeeded: 1, available: "Available now", description: "A furnished ensuite room in a bright apartment just a short walk from Jabi Lake Mall. Shared living room, kitchen and balcony.", preferences: "Open to a friendly, clean and considerate housemate.", name: "Zara I.", age: 25, image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=80", posted: "3 days ago" },
    { id: "room-4", kind: "room", title: "Quiet self-contained space", location: "Utako, Abuja", area: "Utako", price: 700000, roomType: "Self-contained", roomsNeeded: 1, available: "Available 15 Nov", description: "A neat self-contained space in a secure compound. Private kitchenette and bathroom, with parking available.", preferences: "Ideal for one working professional.", name: "Chidi N.", age: 29, image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80", posted: "5 days ago" }
  ];
  const roommateSeeds = [
    { id: "mate-1", kind: "roommate", title: "Looking for a calm place to call home", location: "Maitama, Abuja", area: "Maitama", price: 500000, moveDate: "1 Nov 2025", description: "I work in consulting and keep a pretty balanced routine. Hoping to find a clean, friendly home with good communication and a little space to unwind.", preferences: "Wuse, Maitama or Jabi. Prefer a quiet, tidy household.", name: "Nneka E.", age: 28, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80", posted: "Today" },
    { id: "mate-2", kind: "roommate", title: "Friendly professional seeking a room", location: "Gwarinpa, Abuja", area: "Gwarinpa", price: 350000, moveDate: "15 Nov 2025", description: "I am a young designer looking for a comfortable shared apartment. I enjoy cooking, music at a reasonable volume, and keeping common areas neat.", preferences: "Gwarinpa or Life Camp, ideally sharing with one or two people.", name: "Ibrahim S.", age: 26, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80", posted: "Yesterday" },
    { id: "mate-3", kind: "roommate", title: "Ready to move, hoping to meet a great housemate", location: "Wuse 2, Abuja", area: "Wuse 2", price: 650000, moveDate: "Immediately", description: "I am a nurse with a steady schedule and a warm, easy-going personality. Looking for a safe place and someone who values a considerate home.", preferences: "Wuse, Garki or Jabi. Open to sharing with any gender.", name: "David K.", age: 30, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80", posted: "4 days ago" }
  ];
  const seeds = [...roomSeeds, ...roommateSeeds];
  const readStored = (key, fallback) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (error) {
      console.error(`Could not read ${key} from local storage.`, error);
      return fallback;
    }
  };
  let listings = readStored(STORAGE.listings, seeds);
  let savedIds = readStored(STORAGE.saved, []);
  let messages = readStored(STORAGE.messages, {});
  let contactRequests = readStored(STORAGE.contactRequests, []);
  let acceptedContacts = readStored(STORAGE.acceptedContacts, []);
  let conversationId = new URLSearchParams(window.location.search).get("id") || readStored(STORAGE.conversation, "room-1");
  let toastTimer;

  const money = amount => `₦${Number(amount).toLocaleString("en-NG")}`;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const getListing = id => listings.find(listing => listing.id === id);
  const toast = document.getElementById("toast");
  const page = document.body.dataset.page;

  function store(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Could not save ${key} to local storage.`, error);
      showToast("Your browser couldn't save this change. Check available storage.");
    }
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function syncSharedControls() {
    document.querySelectorAll("[data-saved-count]").forEach(element => { element.textContent = String(savedIds.length); });
    document.querySelectorAll("[data-nav]").forEach(link => link.classList.toggle("active", link.dataset.nav === page || (page === "detail" && link.dataset.nav === "rooms")));
    const dark = readStored(STORAGE.theme, "light") === "dark";
    document.body.classList.toggle("dark-mode", dark);
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(button => button.setAttribute("aria-pressed", String(dark)));
    document.querySelectorAll("[data-saved-summary]").forEach(element => {
      element.textContent = `${savedIds.length} listing${savedIds.length === 1 ? "" : "s"} saved on this device.`;
    });
    document.querySelectorAll("[data-owned-summary]").forEach(element => {
      const count = listings.filter(listing => listing.owned).length;
      element.textContent = `${count} listing${count === 1 ? "" : "s"} created on this device.`;
    });
    document.querySelectorAll("[data-listing-card]").forEach(updateSaveButton);
  }

  function updateSaveButton(card) {
    const button = card.querySelector('[data-action="save"]');
    if (!button) return;
    const saved = savedIds.includes(card.dataset.id);
    button.classList.toggle("is-saved", saved);
    button.textContent = saved ? "♥" : "♡";
    button.setAttribute("aria-label", `${saved ? "Remove from" : "Add to"} saved listings`);
  }

  function cardFromTemplate(listing) {
    const template = document.getElementById("listing-card-template");
    if (!template) return null;
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector("[data-listing-card]");
    const isRoom = listing.kind === "room";
    card.dataset.id = listing.id;
    card.dataset.kind = listing.kind;
    card.dataset.price = String(listing.price);
    card.dataset.area = `${listing.area || listing.location} ${listing.location}`.toLowerCase();
    const setText = (name, value) => { card.querySelector(`[data-field="${name}"]`).textContent = value; };
    const image = card.querySelector('[data-field="image"]');
    image.src = listing.image;
    image.alt = isRoom ? listing.title : `${listing.name}'s profile`;
    const avatar = card.querySelector('[data-field="avatar"]');
    avatar.src = listing.avatar || listing.image;
    avatar.alt = `${listing.name} profile`;
    setText("kind-label", isRoom ? "Room available" : "Looking for a room");
    setText("title", listing.title);
    setText("price", money(listing.price));
    setText("location", `⌖  ${listing.location}`);
    setText("meta-one", isRoom ? `⌂ ${listing.roomType}` : `⇥ Move: ${listing.moveDate || "Flexible"}`);
    setText("meta-two", isRoom ? `＋ ${listing.roomsNeeded} roommate${listing.roomsNeeded === 1 ? "" : "s"}` : `◷ ${listing.age || "—"} yrs`);
    setText("name", listing.name);
    card.querySelector('[data-action="save"]').dataset.id = listing.id;
    const detailsLink = card.querySelector('[data-field="details-link"]');
    detailsLink.href = `listing-details.html?id=${encodeURIComponent(listing.id)}`;
    return fragment;
  }

  function hydrateDynamicListings() {
    const results = document.getElementById("search-results");
    const template = document.getElementById("listing-card-template");
    if (!results || !template) return;
    const existingIds = new Set([...results.querySelectorAll("[data-listing-card]")].map(card => card.dataset.id));
    const kind = document.getElementById("search-form")?.dataset.kind;
    listings.filter(listing => listing.owned && listing.kind === kind && !existingIds.has(listing.id))
      .forEach(listing => results.append(cardFromTemplate(listing)));
  }

  function searchListings() {
    const form = document.getElementById("search-form");
    const results = document.getElementById("search-results");
    if (!form || !results) return;
    const query = (form.elements.location.value || "").trim().toLowerCase();
    const min = Number(form.elements.min.value) || 0;
    const max = Number(form.elements.max.value) || Infinity;
    const kind = form.dataset.kind;
    const order = document.getElementById("sort-order")?.value;
    const visible = [...results.querySelectorAll("[data-listing-card]")].filter(card => {
      const locationMatch = !query || card.dataset.area.includes(query);
      const price = Number(card.dataset.price);
      const matches = card.dataset.kind === kind && locationMatch && price >= min && price <= max;
      card.hidden = !matches;
      return matches;
    });
    visible.sort((left, right) => order === "ascending"
      ? Number(left.dataset.price) - Number(right.dataset.price)
      : order === "descending" ? Number(right.dataset.price) - Number(left.dataset.price) : 0);
    visible.forEach(card => results.append(card));
    const label = kind === "room" ? "rooms" : "people";
    document.getElementById("result-count").textContent = `${visible.length} ${label} found`;
    const empty = document.getElementById("search-empty");
    if (empty) empty.hidden = visible.length > 0;
  }

  function populateSavedListings() {
    const results = document.getElementById("saved-results");
    if (!results) return;
    const empty = document.getElementById("saved-empty");
    const template = document.getElementById("listing-card-template");
    const saved = listings.filter(listing => savedIds.includes(listing.id));
    results.querySelectorAll("[data-listing-card]").forEach(card => card.remove());
    if (!saved.length) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    saved.forEach(listing => results.append(cardFromTemplate(listing)));
  }

  function populateDetails() {
    if (page !== "detail") return;
    const id = new URLSearchParams(window.location.search).get("id");
    const listing = getListing(id);
    const detail = document.getElementById("listing-detail");
    const missing = document.getElementById("detail-not-found");
    if (!listing) {
      detail.hidden = true;
      missing.hidden = false;
      return;
    }
    const isRoom = listing.kind === "room";
    document.title = `${listing.title} — Housemate`;
    document.getElementById("detail-eyebrow").textContent = isRoom ? "Room listing" : "Housemate profile";
    document.getElementById("detail-page-heading").textContent = listing.title;
    document.getElementById("detail-page-intro").textContent = isRoom ? "A closer look at the room, home and the person sharing it." : "A closer look at this housemate and the home they are hoping to find.";
    document.getElementById("detail-back-link").href = isRoom ? "rooms.html" : "roommates.html";
    const image = document.getElementById("detail-image");
    image.src = listing.image;
    image.alt = listing.title;
    document.getElementById("detail-title").textContent = listing.title;
    document.getElementById("detail-price").textContent = money(listing.price);
    document.getElementById("detail-location").textContent = `⌖  ${listing.location} · Posted ${listing.posted || "recently"}`;
    const chips = [
      isRoom ? `⌂ ${listing.roomType}` : `⇥ Moving ${listing.moveDate || "flexibly"}`,
      isRoom ? `＋ ${listing.roomsNeeded} housemate${listing.roomsNeeded === 1 ? "" : "s"} wanted` : `◷ ${listing.age || "—"} years old`,
      isRoom ? `◷ ${listing.available || "Flexible"}` : "Abuja"
    ];
    chips.forEach((text, index) => { document.getElementById(`detail-chip-${["one", "two", "three"][index]}`).textContent = text; });
    document.getElementById("detail-description-heading").textContent = isRoom ? "About this home" : "A little about me";
    document.getElementById("detail-description").textContent = listing.description;
    document.getElementById("detail-preferences-heading").textContent = isRoom ? "The right housemate" : "My ideal home";
    document.getElementById("detail-preferences").textContent = listing.preferences;
    document.getElementById("detail-host-heading").textContent = isRoom ? "Meet your potential housemate" : "Meet this housemate";
    document.getElementById("detail-avatar").src = listing.avatar || listing.image;
    document.getElementById("detail-name").textContent = listing.name;
    document.getElementById("detail-age").textContent = listing.age ? `${listing.age} years old · Abuja` : "Abuja";
    document.getElementById("detail-chat-link").href = `negotiation.html?id=${encodeURIComponent(listing.id)}`;
    updateContactControls(listing);
  }

  function updateContactControls(listing) {
    const requested = contactRequests.includes(listing.id);
    const accepted = acceptedContacts.includes(listing.id);
    document.getElementById("contact-status").textContent = accepted
      ? "Request approved. This demo has no phone number on file, so continue the conversation here."
      : requested ? "Request sent. Waiting for the lister to approve your request. Contact details stay private until then."
        : "Contact details are private. Send a request and the lister can choose whether to connect.";
    const requestButton = document.getElementById("request-contact");
    requestButton.textContent = accepted ? "Contact request approved" : requested ? "Request sent" : "Request contact details";
    requestButton.disabled = requested;
    requestButton.classList.toggle("button-outline", requested);
    requestButton.classList.toggle("button-primary", !requested);
    const approveButton = document.getElementById("approve-contact");
    approveButton.hidden = !(listing.owned && requested && !accepted);
    approveButton.dataset.id = listing.id;
    requestButton.dataset.id = listing.id;
  }

  function defaultMessages(id) {
    const listing = getListing(id);
    const topic = listing?.kind === "room" ? "the room" : "my search";
    return [{ from: "them", text: `Hi! Thanks for taking a look. Feel free to ask me anything about ${topic}.`, time: "Today" }];
  }

  function paintMessages() {
    const container = document.getElementById("chat-messages");
    const listing = getListing(conversationId);
    if (!container || !listing) return;
    document.getElementById("chat-name").textContent = listing.name;
    document.getElementById("chat-listing-title").textContent = listing.title;
    document.getElementById("chat-detail-link").href = `listing-details.html?id=${encodeURIComponent(listing.id)}`;
    document.querySelectorAll(".conversation-item").forEach(item => item.classList.toggle("active", item.dataset.id === listing.id));
    const conversation = messages[listing.id] || defaultMessages(listing.id);
    container.replaceChildren();
    conversation.forEach(message => {
      const bubble = document.createElement("div");
      bubble.className = `chat-message${message.from === "me" ? " mine" : ""}`;
      bubble.append(document.createTextNode(message.text));
      const time = document.createElement("small");
      time.textContent = message.time;
      bubble.append(time);
      container.append(bubble);
    });
    container.scrollTop = container.scrollHeight;
    store(STORAGE.conversation, listing.id);
  }

  function hydrateConversations() {
    const list = document.querySelector(".conversation-list");
    const template = document.getElementById("conversation-template");
    if (!list || !template) return;
    const existing = new Set([...list.querySelectorAll(".conversation-item")].map(item => item.dataset.id));
    listings.filter(listing => !existing.has(listing.id)).forEach(listing => {
      const fragment = template.content.cloneNode(true);
      const item = fragment.querySelector(".conversation-item");
      item.dataset.id = listing.id;
      item.querySelector('[data-field="avatar"]').src = listing.avatar || listing.image;
      item.querySelector('[data-field="name"]').textContent = listing.name;
      item.querySelector('[data-field="title"]').textContent = listing.title;
      list.append(item);
    });
  }

  function updateListingKind(kind) {
    document.querySelectorAll(".room-only").forEach(field => { field.hidden = kind !== "room"; });
    document.querySelectorAll(".roommate-only").forEach(field => { field.hidden = kind !== "roommate"; });
    const roomType = document.getElementById("room-type");
    if (roomType) roomType.required = kind === "room";
    const photoLabel = document.getElementById("listing-photo-label");
    if (photoLabel) photoLabel.textContent = kind === "room" ? "Photo of your room *" : "Your profile photo *";
    const descriptionLabel = document.querySelector('label[for="listing-description"]');
    if (descriptionLabel) descriptionLabel.textContent = kind === "room" ? "A little about your space *" : "A little about you *";
  }

  function submitListing(form) {
    const data = new FormData(form);
    const kind = data.get("kind");
    const required = ["title", "name", "location", "price", "image", "description", "preferences"];
    if (kind === "room") required.push("roomType");
    let valid = true;
    required.forEach(name => {
      const value = String(data.get(name) || "").trim();
      const error = form.querySelector(`[data-error="${name}"]`);
      let message = "";
      if (!value) message = "This field is required.";
      else if (name === "price" && (!Number.isFinite(Number(value)) || Number(value) <= 0)) message = "Enter a valid amount greater than zero.";
      else if (name === "image" && !/^https?:\/\/.+/i.test(value)) message = "Enter a valid photo URL starting with http:// or https://.";
      else if (name === "roomType" && !value) message = "Choose a room type.";
      if (error) error.textContent = message;
      if (message) valid = false;
    });
    const avatar = String(data.get("avatar") || "").trim();
    if (avatar && !/^https?:\/\/.+/i.test(avatar)) {
      form.querySelector('[data-error="image"]').textContent = "Enter a valid profile photo URL starting with http:// or https://.";
      valid = false;
    }
    if (!valid) {
      form.querySelector(".field-error:not(:empty)")?.closest(".field")?.querySelector("input,select,textarea")?.focus();
      return;
    }
    const location = String(data.get("location")).trim();
    const image = String(data.get("image")).trim();
    const listing = {
      id: `user-${Date.now()}`, kind, title: String(data.get("title")).trim(), name: String(data.get("name")).trim(),
      age: Number(data.get("age")) || "", area: location.split(",")[0].trim(),
      location: location.toLowerCase().includes("abuja") ? location : `${location}, Abuja`,
      price: Number(data.get("price")), roomType: kind === "room" ? String(data.get("roomType")) : "",
      roomsNeeded: kind === "room" ? Number(data.get("roomsNeeded")) || 1 : 0,
      moveDate: data.get("moveDate") || "Flexible", image,
      avatar: kind === "roommate" ? image : avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      description: String(data.get("description")).trim(), preferences: String(data.get("preferences")).trim(),
      posted: "Just now", available: "Contact for availability", owned: true
    };
    listings = [listing, ...listings.filter(item => item.id !== listing.id)];
    store(STORAGE.listings, listings);
    const success = document.getElementById("form-success");
    success.textContent = "Your listing is saved in this browser. It is now available in the matching listings.";
    success.classList.add("visible");
    form.reset();
    document.getElementById("kind-room").checked = true;
    updateListingKind("room");
    success.scrollIntoView({ behavior: "smooth", block: "center" });
    showToast("Your listing was created.");
  }

  function appendMessage(text) {
    const listing = getListing(conversationId);
    if (!listing) return;
    const conversation = messages[listing.id] || defaultMessages(listing.id);
    conversation.push({ from: "me", text, time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) });
    messages[listing.id] = conversation;
    store(STORAGE.messages, messages);
    paintMessages();
  }

  document.addEventListener("click", event => {
    const action = event.target.closest("[data-action]");
    if (!action) return;
    if (action.dataset.action === "save") {
      const id = action.dataset.id;
      savedIds = savedIds.includes(id) ? savedIds.filter(saved => saved !== id) : [...savedIds, id];
      store(STORAGE.saved, savedIds);
      syncSharedControls();
      populateSavedListings();
      showToast(savedIds.includes(id) ? "Saved to your listings." : "Removed from saved listings.");
    } else if (action.dataset.action === "toggle-theme") {
      const dark = !document.body.classList.contains("dark-mode");
      document.body.classList.toggle("dark-mode", dark);
      store(STORAGE.theme, dark ? "dark" : "light");
      action.setAttribute("aria-pressed", String(dark));
    } else if (action.dataset.action === "clear-search") {
      document.getElementById("search-form")?.reset();
      searchListings();
    } else if (action.dataset.action === "request-contact") {
      const id = action.dataset.id;
      if (id && !contactRequests.includes(id)) {
        contactRequests.push(id);
        store(STORAGE.contactRequests, contactRequests);
        const listing = getListing(id);
        if (listing) updateContactControls(listing);
        showToast("Contact request sent. The lister can decide whether to connect.");
      }
    } else if (action.dataset.action === "approve-contact") {
      const id = action.dataset.id;
      if (id && !acceptedContacts.includes(id)) {
        acceptedContacts.push(id);
        store(STORAGE.acceptedContacts, acceptedContacts);
        const listing = getListing(id);
        if (listing) updateContactControls(listing);
        showToast("Contact request approved. Continue the conversation in Housemate.");
      }
    } else if (action.dataset.action === "select-chat") {
      conversationId = action.dataset.id;
      paintMessages();
    }
  });

  document.addEventListener("submit", event => {
    const form = event.target;
    if (form.id === "search-form") {
      event.preventDefault();
      searchListings();
    } else if (form.id === "listing-form") {
      event.preventDefault();
      submitListing(form);
    } else if (form.id === "message-form") {
      event.preventDefault();
      const input = form.elements.message;
      if (input.value.trim()) {
        appendMessage(input.value.trim());
        input.value = "";
      }
    } else if (form.id === "offer-form") {
      event.preventDefault();
      const amount = Number(form.elements.amount.value);
      if (!Number.isFinite(amount) || amount <= 0) {
        form.elements.amount.setCustomValidity("Enter a valid proposed rent greater than zero.");
        form.elements.amount.reportValidity();
        return;
      }
      form.elements.amount.setCustomValidity("");
      appendMessage(`I'd like to propose ${money(amount)} per year. Would you be open to discussing it?`);
      form.reset();
      showToast("Your rent proposal was added to the conversation.");
    }
  });

  document.addEventListener("change", event => {
    if (event.target.name === "kind" && event.target.form?.id === "listing-form") updateListingKind(event.target.value);
    if (event.target.id === "sort-order") searchListings();
  });

  const menuButton = document.getElementById("menu-button");
  if (menuButton) {
    menuButton.addEventListener("click", () => {
      const nav = document.getElementById("main-nav");
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
    document.getElementById("main-nav").addEventListener("click", event => {
      if (event.target.closest("a")) {
        document.getElementById("main-nav").classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  syncSharedControls();
  hydrateDynamicListings();
  if (page === "rooms" || page === "roommates") searchListings();
  if (page === "saved") populateSavedListings();
  if (page === "detail") populateDetails();
  if (page === "chat") {
    hydrateConversations();
    paintMessages();
  }
  if (page === "create") {
    const kind = document.querySelector('input[name="kind"]:checked');
    if (kind) updateListingKind(kind.value);
  }
})();
