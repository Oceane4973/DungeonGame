describe('UI-001: Initial UI Verification', function() {
    it('Should verify the initial display of the UI elements', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body', 'Body should be visible')
            .waitForElementVisible('#game', 'Canvas should be visible')

            // Verify canvas positioning based on CSS
            .execute(function() {
                const canvas = document.querySelector('#game');
                const style = window.getComputedStyle(canvas);
                return {
                    display: style.display,
                    borderRadius: style.borderRadius
                };
            }, [], function(result) {
                browser.assert.strictEqual(result.value.display, 'block', 'Canvas should be displayed as block');
                browser.assert.strictEqual(result.value.borderRadius, '5px', 'Canvas should have a border radius of 5px');
            })

            // Verify chronometer
            .waitForElementVisible('#chrono', 'Chronometer should be visible')
            .assert.textEquals('#chrono', '00:00:00', 'Chronometer should display initial time')

            // Verify buttons
            .waitForElementVisible('#control', 'Start button should be visible')
            .assert.textEquals('#control', 'Start', 'Start button should have correct text')
            .waitForElementVisible('#pheromones', 'Phéromones button should be visible')
            .assert.textEquals('#pheromones', 'Phéromones', 'Phéromones button should have correct text')

            // Verify background style
            .execute(function() {
                const body = document.body;
                const style = window.getComputedStyle(body);
                return {
                    backgroundImage: style.backgroundImage,
                    backgroundSize: style.backgroundSize,
                    backgroundPositionX: style.backgroundPositionX
                };
            }, [], function(result) {
                browser.assert.ok(result.value.backgroundImage.includes('treee.png'), 'Background should have tree motif');
                browser.assert.strictEqual(result.value.backgroundSize, '2.95%', 'Background size should match');
                browser.assert.strictEqual(result.value.backgroundPositionX, '18px', 'Background position X should match');
            })
            .end();
    });
});
