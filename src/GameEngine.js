class GameEngine{

    constructor(canvasController) {
        this.timeStart = Date.now();
        this.lag = 0;
        this.fps = 60;
        this.frameDuration = 1000 / this.fps;
        this.cellSize = 100;
        this.timer = 0;
        this.canvasController = canvasController;
        this.pause = false;
        this.total = 0;
        this.chrono = document.querySelector("#chrono");
        this.update = this.update.bind(this);
    }

    updatePheromonesView(display){
        this.canvasController.updatePheromonesView(display)
        this.canvasController.refresh(null)
    }

    update(){
            let currentTime = Date.now();
            if(this.timer === 0){
                this.begin = new Date().getTime()/1000;
            }
            let deltaTime   = currentTime - this.timeStart;
            this.lag += deltaTime;
            this.timeStart = currentTime;
            this.timer += deltaTime;
            this.clock();

            while(this.lag >= this.frameDuration) {
                this.canvasController.refresh(this.timer);
                this.lag -= this.frameDuration;
                if(this.pause){
                    this.lag = 0;
                }
            }
    }

    clock(){
        this.ecart = (new Date().getTime()/1000) - this.begin + this.total;
        const heures = Math.floor(this.ecart / 3600);
        const minutes = Math.floor((this.ecart % 3600) / 60);
        const secondesRestantes = (this.ecart % 60).toFixed(0);
        const millisecondesRestantes = (this.ecart * 1000 % 1000).toFixed(0);

        const formatHeures = heures < 10 ? `0${heures}` : heures;
        const formatMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formatSecondes = secondesRestantes < 10 ? `0${secondesRestantes}` : secondesRestantes;
        const formatMillisecondes = millisecondesRestantes < 10 ? `00${millisecondesRestantes}` : (millisecondesRestantes < 100 ? `0${millisecondesRestantes}` : millisecondesRestantes);

        this.chrono.textContent = `${formatHeures}:${formatMinutes}:${formatSecondes}:${formatMillisecondes}`;
    }

    switchMode(){
        if (this.pause) {
            this.total = this.ecart;
        } else {
            this.begin = new Date().getTime() / 1000;
        }
        this.pause = !this.pause;
    }

    setupLogout() {
        const logoutButton = document.querySelector('#logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                window.location.href = 'login.html';
            });
        }
    }

}

export default GameEngine;
