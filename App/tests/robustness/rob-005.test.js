describe('ROB-005: Browser Compatibility Verification', function() {
    it('Should ensure consistent behavior across Chrome, Firefox, and Edge', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body', 'Body should be visible')
            .waitForElementVisible('#game', 'Canvas should be visible')

            // Verify rendering consistency
            .assert.elementPresent('#control', 'Control button should be present')
            .assert.elementPresent('#pheromones', 'Phéromones button should be present')
            .assert.cssProperty('#game', 'display', 'block', 'Canvas should have correct display property')

            // Verify interaction
            .click('#control')
            .pause(1000) // Wait for state change
            .assert.containsText('#control', 'Pause', 'Control button should toggle to "Pause"')

            // Performance measurement
            .executeAsync(function(done) {
                let frameCount = 0;
                const startTime = performance.now();

                function measureFPS() {
                    frameCount++;
                    if (performance.now() - startTime < 1000) {
                        requestAnimationFrame(measureFPS);
                    } else {
                        done({ fps: frameCount });
                    }
                }

                requestAnimationFrame(measureFPS);
            }, [], function(result) {
                browser.assert.ok(
                    result.value.fps >= 30,
                    `FPS should be consistent (Measured: ${result.value.fps})`
                );
            })

            .end();
    });
});
