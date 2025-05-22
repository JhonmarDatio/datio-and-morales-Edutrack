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
      const { user } = await signUp(email, password);
      
      if (user) {
        // Store additional user info in Supabase profiles table
        const { error } = await supabase
          .from('profiles')
          .insert([
            { 
              id: user.id,
              first_name: firstname,
              last_name: lastname,
              role: role
            }
          ]);

        if (error) throw error;

        alert("✅ Registration successful! Please check your email to verify your account.");
        window.location.href = "login.html";
      }
    } catch (error) {
      alert("❌ " + error.message);
    }
  });
});