import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://izpbbjhikbbbyahxzhkg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cGJiamhpa2JiYnlhaHh6aGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTMxMDUsImV4cCI6MjA2Mzc2OTEwNX0.Gv0WaUlkUAW1qBNEaaXDCWWpwWgbvBTya8KQzFhx08s'; // (המפתח המלא שלך)

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// פונקציית איפוס סיסמה
window.resetPassword = async function () {
    const email = prompt("הזן את כתובת המייל שלך לאיפוס סיסמה:");
    if (!email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://netzach1232.github.io/Recipes-good/update-password.html'
    });

    if (error) {
        alert("אירעה שגיאה: " + error.message);
    } else {
        alert("נשלח אליך מייל עם קישור לאיפוס סיסמה.");
    }
};

async function login() {
    const email = document.getElementById("username").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        document.getElementById("error").textContent = "יש למלא את כל השדות.";
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.log("שגיאה בלוגין:", error.message);
        document.getElementById("error").textContent = "אימייל או סיסמה שגויים.";
        return;
    }

    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    document.cookie = `session=true; expires=${now.toUTCString()}; path=/`;

    window.location.href = "home.html";
}

function openRegister() {
    document.getElementById("registerOverlay").classList.remove("hidden");
}

function closeRegister() {
    document.getElementById("registerOverlay").classList.add("hidden");
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function clearErrors() {
    document.getElementById("firstNameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
}

async function register() {
    const fname = document.getElementById("firstName").value.trim();
    const lname = document.getElementById("lastName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    clearErrors();
    let hasError = false;

    if (!fname) {
        document.getElementById("firstNameError").textContent = "יש להזין שם פרטי";
        hasError = true;
    }

    if (!lname) {
        document.getElementById("lastNameError").textContent = "יש להזין שם משפחה";
        hasError = true;
    }

    if (!email) {
        document.getElementById("emailError").textContent = "יש להזין אימייל";
        hasError = true;
    } else if (!isValidEmail(email)) {
        document.getElementById("emailError").textContent = "האימייל לא תקין";
        hasError = true;
    }

    if (!password) {
        document.getElementById("passwordError").textContent = "יש להזין סיסמה";
        hasError = true;
    } else if (password.length < 8) {
        document.getElementById("passwordError").textContent = "הסיסמה חייבת להיות לפחות 8 תווים";
        hasError = true;
    }

    if (password !== confirmPassword) {
        document.getElementById("confirmError").textContent = "הסיסמאות לא תואמות";
        hasError = true;
    }

    if (hasError) return;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            createSession: false,
            emailRedirectTo: "https://netzach1232.github.io/Recipes-good/index.html"
        }
    });

    if (error) {
        document.getElementById("emailError").textContent = "האימייל כבר קיים או שגיאה כללית";
        return;
    }

    localStorage.setItem("registeredEmail", email);

    // 🔴 קריטי – מונע התחברות מיידית לפני אישור אימייל
    await supabase.auth.signOut();

    window.location.href = "success.html";
}




window.openRegister = openRegister;
window.closeRegister = closeRegister;
window.login = login;
window.register = register;


