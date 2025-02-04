export function checkAuth() {
    return localStorage.getItem("isLoggedIn") === "true";
}
