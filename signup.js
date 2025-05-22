document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");

  
  const role = sessionStorage.getItem("selectedRole") || "student";

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

 
    if (password !== confirmPassword) {
      alert("❌ Password and Confirm Password do not match.");
      return;
    }

   
    if (!firstname || !lastname || !email || !password) {
      alert("❌ Please fill all required fields.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

 
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
      alert("⚠️ Email is already registered.");
      return;
    }

    
    const newUser = {
      firstname,
      lastname,
      email,
      password,
      role
    };

    
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("✅ Registration successful!");
    window.location.href = "login.html";
  });
});
