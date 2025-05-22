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

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const matchedUser = users.find(
      user => user.email === email && user.password === password && user.role === role
    );

    if (matchedUser) {
      alert(`✅ Welcome, ${matchedUser.firstname}!`);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(matchedUser));
      
      if (role === "student") {
        window.location.href = "marking.html";
      } else if (role === "teacher") {
        window.location.href = "dash.html";
      }
    } else {
      alert("❌ Invalid email or password");
    }
  });
});
