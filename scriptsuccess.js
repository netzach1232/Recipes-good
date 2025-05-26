const email = localStorage.getItem("registeredEmail");

if (email) {
    document.getElementById("userEmail").textContent = email;

    const domain = email.split("@")[1].toLowerCase();
    let mailLink = "";

    if (domain.includes("gmail")) {
        mailLink = "https://mail.google.com/";
    } else if (domain.includes("outlook") || domain.includes("hotmail") || domain.includes("live")) {
        mailLink = "https://outlook.live.com/";
    } else if (domain.includes("yahoo")) {
        mailLink = "https://mail.yahoo.com/";
    } else {
        mailLink = "https://" + domain;
    }

    const button = document.createElement("button");
    button.textContent = "פתח את תיבת הדוא\"ל";
    button.onclick = () => window.open(mailLink, "_blank");

    document.getElementById("emailButtonContainer").appendChild(button);

    localStorage.removeItem("registeredEmail"); // מנקה את הזיכרון
}