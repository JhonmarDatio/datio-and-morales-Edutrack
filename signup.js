import { signUp } from './src/auth.js';

document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const role = sessionStorage.getItem("selectedRole") || "student";

  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();

    if (password !== confirmPassword) {
      alert("❌ Password and Confirm Password do not match.");
      return;
    }

    if (!firstname || !lastname || !email || !password) {
      alert("❌ Please fill all required fields.");
      return;
    }

    try {
      await signUp(email, password, firstname, lastname, role);
      alert("✅ Registration successful!");
      window.location.href = "login.html";
    } catch (error) {
      alert("❌ " + error.message);
    }
  });
});