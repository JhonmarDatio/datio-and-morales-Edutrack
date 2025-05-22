function redirectToLogin(e) {
  e.preventDefault();

  const email = document.querySelector('input[type="email"]').value.trim();
  const newPassword = document.querySelector('input[placeholder="New Password"]').value.trim();
  const confirmPassword = document.querySelector('input[placeholder="Confirm Password"]').value.trim();

  if (newPassword !== confirmPassword) {
    alert("❌ New Password and Confirm Password do not match.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Find user by email
  const userIndex = users.findIndex(user => user.email === email);

  if (userIndex === -1) {
    alert("⚠️ Email not found. Please sign up first.");
    return;
  }

  // Update password
  users[userIndex].password = newPassword;

  localStorage.setItem("users", JSON.stringify(users));

  alert("✅ Password reset successful! Please login with your new password.");
  window.location.href = "login.html";
}
