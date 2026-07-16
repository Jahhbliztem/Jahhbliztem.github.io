const STORAGE_KEY = "taxhubUsers";
const ACTIVE_USER_KEY = "taxhubActiveUser";

function formatMoney(value){
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });
}

function getUsers(){
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveUsers(users){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getActiveUser(){
    try {
        return JSON.parse(localStorage.getItem(ACTIVE_USER_KEY));
    } catch (error) {
        return null;
    }
}

function setActiveUser(user){
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
}

function clearActiveUser(){
    localStorage.removeItem(ACTIVE_USER_KEY);
}

function openModal(mode){
    const modal = document.getElementById("authModal");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const tabs = document.querySelectorAll(".tab-btn");

    tabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.mode === mode);
    });

    loginForm.classList.toggle("active-form", mode === "login");
    signupForm.classList.toggle("active-form", mode === "signup");
    modal.classList.remove("hidden");
}

function closeModal(){
    document.getElementById("authModal").classList.add("hidden");
}

function updateAuthState(user){
    const openLogin = document.getElementById("openLogin");
    const openSignup = document.getElementById("openSignup");
    const logoutButton = document.getElementById("logoutButton");
    const heroSignup = document.getElementById("heroSignup");
    const heroLogin = document.getElementById("heroLogin");
    const ctaSignup = document.getElementById("ctaSignup");
    const ctaLogin = document.getElementById("ctaLogin");
    const heroAction = document.getElementById("heroAction");
    const accountTitle = document.getElementById("accountTitle");
    const accountText = document.getElementById("accountText");
    const accountBadge = document.getElementById("accountBadge");

    const showAuthButtons = !user;

    if (openLogin) openLogin.classList.toggle("hidden", !showAuthButtons);
    if (openSignup) openSignup.classList.toggle("hidden", !showAuthButtons);
    if (logoutButton) logoutButton.classList.toggle("hidden", showAuthButtons);
    if (heroSignup) heroSignup.classList.toggle("hidden", !showAuthButtons);
    if (heroLogin) heroLogin.classList.toggle("hidden", !showAuthButtons);
    if (ctaSignup) ctaSignup.classList.toggle("hidden", !showAuthButtons);
    if (ctaLogin) ctaLogin.classList.toggle("hidden", !showAuthButtons);

    if (user) {
        accountTitle.textContent = `Welcome back, ${user.name.split(" ")[0]}`;
        accountText.textContent = "You are signed in and ready to manage tax reminders, support requests, and secure document access.";
        accountBadge.textContent = "Signed in";
        heroAction.textContent = "Open dashboard";
        heroAction.onclick = () => document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
    } else {
        accountTitle.textContent = "Welcome to TaxHub";
        accountText.textContent = "Create an account to unlock your personal tax dashboard, tax reminders, and secure support tools.";
        accountBadge.textContent = "Guest mode";
        heroAction.textContent = "Create Account";
        heroAction.onclick = () => openModal("signup");
    }
}

function showMessage(formId, text, isError = false){
    const messageBox = document.getElementById(formId);
    if (messageBox) {
        messageBox.textContent = text;
        messageBox.style.color = isError ? "#c0392b" : "#2E7D32";
    }
}

function handleSignup(event){
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirm").value;

    if (!name || !email || !password || !confirmPassword) {
        showMessage("signupMessage", "Please complete every field.", true);
        return;
    }

    if (password.length < 6) {
        showMessage("signupMessage", "Password should be at least 6 characters.", true);
        return;
    }

    if (password !== confirmPassword) {
        showMessage("signupMessage", "Passwords do not match.", true);
        return;
    }

    const users = getUsers();
    const existingUser = users.find((entry) => entry.email === email);

    if (existingUser) {
        showMessage("signupMessage", "An account with that email already exists.", true);
        return;
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    saveUsers(users);
    setActiveUser(newUser);
    updateAuthState(newUser);
    closeModal();
    showMessage("signupMessage", "Account created successfully.");
}

function handleLogin(event){
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();
    const user = users.find((entry) => entry.email === email && entry.password === password);

    if (!user) {
        showMessage("loginMessage", "Incorrect email or password.", true);
        return;
    }

    setActiveUser(user);
    updateAuthState(user);
    closeModal();
    showMessage("loginMessage", "Signed in successfully.");
}

function logoutUser(){
    clearActiveUser();
    updateAuthState(null);
}

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();

    const activeUser = getActiveUser();
    updateAuthState(activeUser);

    document.getElementById("heroSignup").addEventListener("click", () => openModal("signup"));
    document.getElementById("heroLogin").addEventListener("click", () => openModal("login"));
    document.getElementById("ctaSignup").addEventListener("click", () => openModal("signup"));
    document.getElementById("ctaLogin").addEventListener("click", () => openModal("login"));
    document.getElementById("openSignup").addEventListener("click", () => openModal("signup"));
    document.getElementById("openLogin").addEventListener("click", () => openModal("login"));
    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("logoutButton").addEventListener("click", logoutUser);
    document.getElementById("authModal").addEventListener("click", (event) => {
        if (event.target.id === "authModal") {
            closeModal();
        }
    });

    document.querySelectorAll(".tab-btn").forEach((button) => {
        button.addEventListener("click", () => openModal(button.dataset.mode));
    });

    document.getElementById("signupForm").addEventListener("submit", handleSignup);
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
});