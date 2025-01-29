describe('UI-006: Button Interaction Without Hover Tests', function() {
    it('Should verify button states and interactions without testing hover', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body', 'Body should be visible')
            .waitForElementVisible('#control', 'Control button should be visible')
            .waitForElementVisible('#pheromones', 'Phéromones button should be visible')

            // Verify click feedback and state toggle for the Control button
            .click('#control')
            .pause(1000) // Wait for the state change
            .assert.containsText('#control', 'Pause', 'Control button text should change to "Pause" after click')

            // Verify click feedback and state toggle for the Pheromones button
            .click('#pheromones')
            .pause(500)
            .assert.visible('#pheromones', 'Phéromones button should remain visible after click')

            // Verify transitions for both buttons
            .execute(function() {
                const controlButton = document.querySelector('#control');
                const pheromonesButton = document.querySelector('#pheromones');
                const controlTransition = window.getComputedStyle(controlButton).transition;
                const pheromonesTransition = window.getComputedStyle(pheromonesButton).transition;
                return {
                    controlTransition,
                    pheromonesTransition,
                };
            }, [], function(result) {
                browser.assert.ok(result.value.controlTransition.includes('all'), 'Control button should have smooth transitions');
                browser.assert.ok(result.value.pheromonesTransition.includes('all'), 'Phéromones button should have smooth transitions');
            })

            .end();
    });
});
