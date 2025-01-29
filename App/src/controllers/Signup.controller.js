import userService from '../services/userService.js';

export default class SignupController {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = this.form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            try {
                await this.handleSignup();
            } finally {
                submitButton.disabled = false;
            }
        });
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
        const errorDiv = document.getElementById('signupError') || this.createErrorElement();
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    createErrorElement() {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'signupError';
        errorDiv.className = 'error-message';
        this.form.insertBefore(errorDiv, this.form.firstChild);
        return errorDiv;
    }
}

// Initialize controller
new SignupController(); 