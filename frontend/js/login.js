// Get elements

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const errorMessage = document.getElementById("errorMessage");

const loginBtn = document.getElementById("loginBtn");

const loginTitle = document.getElementById("loginTitle");

const togglePassword = document.getElementById("togglePassword");


// -------------------------------
// Detect Role from URL
// -------------------------------

const params = new URLSearchParams(window.location.search);

const role = params.get("role") || "employee";

if (role === "manager") {

    loginTitle.textContent = "Manager Login";

    loginBtn.textContent = "Sign In as Manager";

} else {

    loginTitle.textContent = "Employee Login";

    loginBtn.textContent = "Sign In as Employee";

}


// -------------------------------
// Show / Hide Password
// -------------------------------

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

    } else {

        passwordInput.type = "password";

    }

});


// -------------------------------
// Login
// -------------------------------

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    errorMessage.textContent = "";

    const email = emailInput.value.trim();

    const password = passwordInput.value.trim();

    if (!email || !password) {

        errorMessage.textContent =
            "Please fill all fields.";

        return;
    }

    loginBtn.disabled = true;

    loginBtn.textContent = "Signing In...";

    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            errorMessage.textContent =
                data.message;

            loginBtn.disabled = false;

            loginBtn.textContent = "Sign In";

            return;
        }

        // Store token

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "role",
            data.role
        );

        localStorage.setItem(
            "name",
            data.name
        );

        // Redirect

        if (data.role === "manager") {

            window.location.href =
                "manager-dashboard.html";

        } else {

            window.location.href =
                "employee-dashboard.html";

        }

    } catch (error) {

        console.log(error);

        errorMessage.textContent =
            "Server Error";

    }

    loginBtn.disabled = false;

    loginBtn.textContent = "Sign In";

});