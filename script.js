import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://izpbbjhikbbbyahxzhkg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cGJiamhpa2JiYnlhaHh6aGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTMxMDUsImV4cCI6MjA2Mzc2OTEwNX0.Gv0WaUlkUAW1qBNEaaXDCWWpwWgbvBTya8KQzFhx08s'; // שים את המפתח המלא שלך פה

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    },
    global: {
        headers: {
            apikey: SUPABASE_KEY
        }
    }
});


async function login() {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

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

    clearErrors();
    let hasError = false;

    if (!fname) {
        document.getElementById("firstNameError").textContent = "יש להזין שם פרטי";
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

    if (hasError) return;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        document.getElementById("emailError").textContent = "האימייל כבר קיים או שגיאה כללית";
        return;
    }

    window.location.href = "success.html";
}



window.openRegister = openRegister;
window.closeRegister = closeRegister;
window.login = login;
window.register = register;


