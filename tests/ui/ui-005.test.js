describe('UI-005: Chronometer Display and Accuracy', function() {
    it('Should verify the format, update, and accuracy of the chronometer', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body', 'Body should be visible')
            .waitForElementVisible('#chrono', 'Chronometer should be visible')
            .waitForElementVisible('#control', 'Control button should be visible')

            // Start the simulation
            .waitForElementVisible('#control', 'Start button should be visible')
            .click('#control') // Correctly interacting with the button
            .pause(2000) // Wait for 2 seconds to observe the chronometer updates

            // Verify the format of the chronometer
            .execute(function() {
                const chronoText = document.querySelector('#chrono').textContent;
                const formatRegex = /^\d{2}:\d{2}:\d{2}:\d{2,3}$/; // HH:MM:SS:MS (MS can be 2-3 digits)
                return {
                    chronoText,
                    formatCorrect: formatRegex.test(chronoText)
                };
            }, [], function(result) {
                browser.assert.ok(result.value.formatCorrect, `Chronometer format should be HH:MM:SS:MS (Got: ${result.value.chronoText})`);
            })

            // Verify the chronometer updates
            .executeAsync(function(done) {
                const initialTime = document.querySelector('#chrono').textContent;
                setTimeout(() => {
                    const updatedTime = document.querySelector('#chrono').textContent;
                    done({
                        initialTime,
                        updatedTime,
                        hasUpdated: initialTime !== updatedTime
                    });
                }, 1500); // Wait 1.5 seconds
            }, [], function(result) {
                browser.assert.ok(result.value.hasUpdated, `Chronometer should update (Initial: ${result.value.initialTime}, Updated: ${result.value.updatedTime})`);
            })

            // Pause the simulation
            .click('#control')
            .pause(1000) // Wait to confirm pause

            // Verify chronometer stops updating on pause
            .executeAsync(function(done) {
                const pausedTime = document.querySelector('#chrono').textContent;
                setTimeout(() => {
                    const currentPausedTime = document.querySelector('#chrono').textContent;
                    done({
                        pausedTime,
                        isPaused: pausedTime === currentPausedTime
                    });
                }, 1500); // Wait 1.5 seconds
            }, [], function(result) {
                browser.assert.ok(result.value.isPaused, `Chronometer should stop updating when paused (Time: ${result.value.pausedTime})`);
            })

            // Resume the simulation
            .click('#control')
            .pause(2000) // Wait to observe resumption

            // Verify chronometer resumes updating
            .executeAsync(function(done) {
                const resumedTime = document.querySelector('#chrono').textContent;
                setTimeout(() => {
                    const updatedResumedTime = document.querySelector('#chrono').textContent;
                    done({
                        resumedTime,
                        updatedResumedTime,
                        hasResumed: resumedTime !== updatedResumedTime
                    });
                }, 1500); // Wait 1.5 seconds
            }, [], function(result) {
                browser.assert.ok(result.value.hasResumed, `Chronometer should resume updating after pause (Initial: ${result.value.resumedTime}, Updated: ${result.value.updatedResumedTime})`);
            })

            .end();
    });
});
