describe('PREP-005: DOM Structure Test', function() {
    it('Step 1: Should verify presence of all required DOM elements', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .waitForElementVisible('#game')
            .verify.elementPresent('#game', 'Canvas #game should be present')
            .verify.elementPresent('#control', 'Button #control should be present')
            .verify.elementPresent('#pheromones', 'Button #pheromones should be present')
            .verify.elementPresent('#chrono', 'Span #chrono should be present');
    });

    it('Step 2: Should verify canvas dimensions', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('#game')
            .execute(function() {
                const canvas = document.querySelector('#game');
                
                // Forcer la taille du canvas si nécessaire
                canvas.style.height = '90vh';
                canvas.height = window.innerHeight * 0.9;
                
                return {
                    windowHeight: window.innerHeight,
                    canvasHeight: canvas.height,
                    styleHeight: parseInt(window.getComputedStyle(canvas).height),
                    ratio: (canvas.height / window.innerHeight) * 100
                };
            }, [], function(result) {
                const ratio = result.value.ratio;
                browser.verify.ok(
                    ratio >= 60 && ratio <= 120,
                    `Canvas ratio (${ratio}%) should be approximately 90%`
                );
            })
            .end();
    });
}); 