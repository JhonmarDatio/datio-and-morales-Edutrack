import { signIn } from './src/auth.js';

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const signupLink = document.querySelector(".signup-link a");

  const role = sessionStorage.getItem("selectedRole");

  if (!role) {
    alert("❗Please select a role first from the landing page.");
    window.location.href = "index.html";
    return;
  }

  if (signupLink) {
    signupLink.href = "signup.html";
  }

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    try {
      const { user } = await signIn(email, password);
      
      if (user.role !== role) {
        throw new Error(`Invalid role. Please login as a ${role}`);
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      if (role === "student") {
        window.location.href = "marking.html";
      } else if (role === "teacher") {
        window.location.href = "dash.html";
      }
    } catch (error) {
      alert("❌ " + error.message);
    }
  });
});