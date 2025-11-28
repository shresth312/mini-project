
const loginBtn = document.getElementById("btn");
const usernameInput = document.getElementById("inp");
const passwordInput = document.getElementById("pass");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    alert("Please fill in both fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login Successful!");
      window.location.href = "index.html"; 
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Server error. Is backend running?");
    console.error(err);
  }
});
