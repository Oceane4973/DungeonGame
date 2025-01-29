export default class LoginController {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        window.location.href = '/src/pages/heroes/heroes.html';
        // Simple validation example - you should implement proper authentication
        // if (username && password) {
        //     // // Store login state
        //     // localStorage.setItem('isLoggedIn', 'true');
        //     // localStorage.setItem('username', username);
            
        //     // Redirect to heroes page
        //     // window.location.href = 'src/pages/heroes/heroes.html';
        // } else {
        //     alert('Please enter both username and password');
        // }
    }
}

// Initialize controller
new LoginController();
