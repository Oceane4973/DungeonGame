import userService from '../services/userService.js';

export default class UserController {
    constructor() {
        this.setupForm();
    }

    setupForm() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (loginForm) {
            this.setupLoginForm(loginForm);
        } else if (signupForm) {
            this.setupSignupForm(signupForm);
        }
    }

    setupLoginForm(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            try {
                await this.handleLogin();
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    setupSignupForm(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            try {
                await this.handleSignup();
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    async handleLogin() {
        try {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!username || !password) {
                this.showError('Veuillez remplir tous les champs');
                return;
            }

            await userService.login(username, password);
            window.location.href = './src/pages/heroes/heroes.html';
        } catch (error) {
            this.showError(error.message || 'Erreur lors de la connexion');
        }
    }

    async handleSignup() {
        try {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!username || !password || !confirmPassword) {
                this.showError('Veuillez remplir tous les champs');
                return;
            }

            if (password !== confirmPassword) {
                this.showError('Les mots de passe ne correspondent pas');
                return;
            }

            await userService.signup(username, password);
            window.location.href = '../../../index.html';
        } catch (error) {
            this.showError(error.message || 'Erreur lors de l\'inscription');
        }
    }

    showError(message) {
        const formType = document.getElementById('loginForm') ? 'login' : 'signup';
        const errorDiv = document.getElementById(`${formType}Error`) || this.createErrorElement(formType);
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    createErrorElement(formType) {
        const errorDiv = document.createElement('div');
        errorDiv.id = `${formType}Error`;
        errorDiv.className = 'error-message';
        const form = document.getElementById(`${formType}Form`);
        form.insertBefore(errorDiv, form.firstChild);
        return errorDiv;
    }
}

// Initialize controller
new UserController();
