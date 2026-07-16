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

const ACTION_TASKS_KEY = "taxhubActionTasks";
const MEMBERSHIP_PLAN_KEY = "taxhubMembershipPlan";

function getActionTasks(){
    try {
        return JSON.parse(localStorage.getItem(ACTION_TASKS_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveActionTasks(tasks){
    localStorage.setItem(ACTION_TASKS_KEY, JSON.stringify(tasks));
}

function renderActionTasks(){
    const list = document.getElementById("actionList");
    if (!list) return;

    const tasks = getActionTasks();
    list.innerHTML = "";

    if (!tasks.length) {
        list.innerHTML = '<li>Welcome task: Explore your tax overview</li>';
        return;
    }

    tasks.slice(-4).reverse().forEach((task) => {
        const item = document.createElement("li");
        item.textContent = task;
        list.appendChild(item);
    });
}

function updateActionStatus(message){
    const status = document.getElementById("actionStatus");
    if (status) {
        status.textContent = message;
    }
}

function addActionTask(taskText){
    const tasks = getActionTasks();
    tasks.push(taskText);
    saveActionTasks(tasks);
    renderActionTasks();
}

function setMembershipPlan(planName, amount, description){
    const summaryTitle = document.getElementById("planSummaryTitle");
    const summaryText = document.getElementById("planSummaryText");
    const payButton = document.getElementById("payPlanButton");

    if (summaryTitle) summaryTitle.textContent = `${planName} plan selected`;
    if (summaryText) summaryText.textContent = description;
    if (payButton) payButton.textContent = `Pay ${planName}`;

    localStorage.setItem(MEMBERSHIP_PLAN_KEY, planName);
}

function showPlan(plan){
    document.querySelectorAll(".plan-tab").forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.plan === plan);
    });

    document.querySelectorAll(".plan-card").forEach((card) => {
        card.classList.toggle("active", card.id === `plan-${plan}`);
    });

    const details = {
        starter: {
            name: "Starter",
            amount: "$9/mo",
            description: "Great for getting started with guided answers and simple filing help."
        },
        growth: {
            name: "Growth",
            amount: "$24/mo",
            description: "Perfect for ongoing support, planning, and more frequent tutoring."
        },
        premium: {
            name: "Premium",
            amount: "$49/mo",
            description: "Best for dedicated mentoring, premium guidance, and custom planning."
        }
    };

    const selected = details[plan];
    if (selected) {
        setMembershipPlan(`${selected.name}`, selected.amount, selected.description);
    }
}

function addChatMessage(text, isUser = false){
    const messages = document.getElementById("chatMessages");
    if (!messages) return;

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${isUser ? "user" : "bot"}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
}

function getAiReply(message){
    const lower = message.toLowerCase();

    if (lower.includes("deduction")) {
        return "Common deductions can include education costs, charitable gifts, and work-related expenses. Keep receipts and review your eligibility carefully.";
    }

    if (lower.includes("deadline") || lower.includes("file")) {
        return "Filing deadlines vary by region and status, so it helps to review your local requirements and keep a checklist ready.";
    }

    if (lower.includes("tutor") || lower.includes("help")) {
        return "You can use our tutoring plans for guided help with filing questions, planning, and document review.";
    }

    return "I can help with basic tax questions, deductions, deadlines, and tutoring options. Ask me something more specific.";
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

function openCheckoutModal(){
    const modal = document.getElementById("checkoutModal");
    const summary = document.getElementById("checkoutSummary");
    const selectedPlan = localStorage.getItem(MEMBERSHIP_PLAN_KEY) || "Starter";

    if (summary) {
        summary.textContent = `You are about to pay for the ${selectedPlan} tutoring plan.`;
    }

    if (modal) {
        modal.classList.remove("hidden");
    }
}

function closeCheckoutModal(){
    const modal = document.getElementById("checkoutModal");
    if (modal) {
        modal.classList.add("hidden");
    }
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
    const profileChip = document.getElementById("profileChip");
    const profileName = document.getElementById("profileName");
    const profileAvatar = document.getElementById("profileAvatar");

    const showAuthButtons = !user;

    if (openLogin) openLogin.classList.toggle("hidden", !showAuthButtons);
    if (openSignup) openSignup.classList.toggle("hidden", !showAuthButtons);
    if (logoutButton) logoutButton.classList.toggle("hidden", showAuthButtons);
    if (heroSignup) heroSignup.classList.toggle("hidden", !showAuthButtons);
    if (heroLogin) heroLogin.classList.toggle("hidden", !showAuthButtons);
    if (ctaSignup) ctaSignup.classList.toggle("hidden", !showAuthButtons);
    if (ctaLogin) ctaLogin.classList.toggle("hidden", !showAuthButtons);

    if (profileChip) profileChip.classList.toggle("hidden", !user);
    if (profileName && user) profileName.textContent = user.name.split(" ")[0];
    if (profileAvatar && user) profileAvatar.textContent = user.name.charAt(0).toUpperCase();

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
    renderActionTasks();

    const savedPlan = localStorage.getItem(MEMBERSHIP_PLAN_KEY);
    if (savedPlan) {
        showPlan(savedPlan.toLowerCase());
    } else {
        showPlan("starter");
    }

    document.getElementById("heroSignup").addEventListener("click", () => openModal("signup"));
    document.getElementById("heroLogin").addEventListener("click", () => openModal("login"));
    document.getElementById("ctaSignup").addEventListener("click", () => openModal("signup"));
    document.getElementById("ctaLogin").addEventListener("click", () => openModal("login"));
    document.getElementById("openSignup").addEventListener("click", () => openModal("signup"));
    document.getElementById("openLogin").addEventListener("click", () => openModal("login"));
    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("closeCheckoutModal").addEventListener("click", closeCheckoutModal);
    document.getElementById("logoutButton").addEventListener("click", logoutUser);
    document.getElementById("authModal").addEventListener("click", (event) => {
        if (event.target.id === "authModal") {
            closeModal();
        }
    });
    document.getElementById("checkoutModal").addEventListener("click", (event) => {
        if (event.target.id === "checkoutModal") {
            closeCheckoutModal();
        }
    });

    document.querySelectorAll(".tab-btn").forEach((button) => {
        button.addEventListener("click", () => openModal(button.dataset.mode));
    });

    document.getElementById("signupForm").addEventListener("submit", handleSignup);
    document.getElementById("loginForm").addEventListener("submit", handleLogin);

    document.querySelectorAll(".action-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const action = button.dataset.action;
            const user = getActiveUser();

            if (action === "checklist") {
                addActionTask("Added filing checklist to your workspace");
                updateActionStatus(user ? "Checklist saved to your workspace." : "Checklist ready. Sign in to save it permanently.");
            } else if (action === "review") {
                addActionTask("Started a document review step");
                updateActionStatus(user ? "Review step added to your plan." : "Review step queued. Sign in to keep it saved.");
            } else if (action === "support") {
                addActionTask("Booked a support follow-up");
                updateActionStatus(user ? "Support request added." : "Support request queued. Sign in to keep it saved.");
            } else if (action === "plan") {
                document.getElementById("pricing").scrollIntoView({ behavior: "smooth" });
                updateActionStatus("Membership options opened below.");
            } else if (action === "guide") {
                addActionTask("Downloaded the starter tax guide");
                updateActionStatus("Starter guide prepared for download.");
            }
        });
    });

    const chatInput = document.getElementById("chatInput");
    const chatSend = document.getElementById("chatSend");

    function sendChatMessage(){
        const message = chatInput.value.trim();
        if (!message) return;

        addChatMessage(message, true);
        chatInput.value = "";
        addChatMessage(getAiReply(message));
        addActionTask(`Asked the AI assistant: ${message}`);
    }

    chatSend.addEventListener("click", sendChatMessage);
    chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendChatMessage();
        }
    });

    document.querySelectorAll(".plan-tab").forEach((button) => {
        button.addEventListener("click", () => showPlan(button.dataset.plan));
    });

    document.querySelectorAll(".plan-select-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const planName = button.dataset.planName.toLowerCase();
            showPlan(planName);
            updateActionStatus(`${button.dataset.planName} plan selected. Choose pay to continue.`);
        });
    });

    document.getElementById("payPlanButton").addEventListener("click", () => {
        const user = getActiveUser();
        if (!user) {
            updateActionStatus("Create an account to secure your membership choice.");
            openModal("signup");
            return;
        }

        const selected = localStorage.getItem(MEMBERSHIP_PLAN_KEY) || "Starter";
        updateActionStatus(`${selected} membership is ready for checkout.`);
        openCheckoutModal();
    });

    document.getElementById("checkoutForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const messageBox = document.getElementById("checkoutMessage");
        const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, "");
        const cvv = document.getElementById("cardCvv").value;

        if (cardNumber.length < 12 || cvv.length < 3) {
            if (messageBox) {
                messageBox.textContent = "Please enter a valid card number and CVV.";
                messageBox.style.color = "#c0392b";
            }
            return;
        }

        if (messageBox) {
            messageBox.textContent = "Payment received. Your tutoring plan is now active.";
            messageBox.style.color = "#2E7D32";
        }

        setTimeout(() => {
            closeCheckoutModal();
            updateActionStatus("Payment completed successfully.");
        }, 1000);
    });

    let progressStep = 1;
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");

    function updateProgress(){
        const percent = (progressStep / 4) * 100;
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `Step ${progressStep} of 4`;
    }

    document.getElementById("progressAdd").addEventListener("click", () => {
        progressStep = Math.min(progressStep + 1, 4);
        updateProgress();
        addActionTask("Advanced your filing progress");
    });

    document.getElementById("progressReset").addEventListener("click", () => {
        progressStep = 1;
        updateProgress();
    });

    updateProgress();

    document.getElementById("calcButton").addEventListener("click", () => {
        const income = Number(document.getElementById("incomeInput").value);
        const result = document.getElementById("calcResult");

        if (!income || income <= 0) {
            result.textContent = "Enter a valid income amount.";
            return;
        }

        const estimate = (income * 0.18).toFixed(2);
        result.textContent = `Estimated tax: $${estimate}`;
        addActionTask("Calculated an estimated tax amount");
    });
});