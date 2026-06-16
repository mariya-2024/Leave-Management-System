// Check whether user is logged in

function getToken() {
    return localStorage.getItem("token");
}

// Get logged in user's name

function getUserName() {
    return localStorage.getItem("name");
}

// Get logged in user's role

function getUserRole() {
    return localStorage.getItem("role");
}

// Logout

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    window.location.href = "login.html";

}

// Redirect if not logged in

function checkAuthentication() {

    const token = getToken();

    if (!token) {

        window.location.href = "login.html";

    }

}