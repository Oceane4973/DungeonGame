describe('PERF-001: Rendering Performance Evaluation', function() {
    it('Should measure FPS and rendering times under different conditions', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body', 'Body should be visible')
            .waitForElementVisible('#game', 'Canvas should be visible')

            // Start the simulation
            .waitForElementVisible('#control', 'Control button should be visible')
            .click('#control')
            .pause(2000) // Allow simulation to initialize

            // Measure FPS at startup
            .executeAsync(function(done) {
                let frameCount = 0;
                const startTime = performance.now();

                const measureFPS = () => {
                    frameCount++;
                    if (performance.now() - startTime < 1000) {
                        window.requestAnimationFrame(measureFPS);
                    } else {
                        done({ fps: frameCount });
                    }
                };

                window.requestAnimationFrame(measureFPS);
            }, [], function(result) {
                browser.assert.ok(result.value.fps >= 60, `FPS at startup should be >= 60 (Measured: ${result.value.fps})`);
            })

            // Add 10 ants and measure FPS
            .execute(function() {
                const antsController = window.canvasController.ants;
                for (let i = 0; i < 10; i++) {
                    antsController.ants.push({ model: new AntM(antsController.canvas, antsController.map), view: new AntV(antsController.canvas, antsController.map.cellSize) });
                }
            })
            .pause(2000)
            .executeAsync(function(done) {
                let frameCount = 0;
                const startTime = performance.now();

                const measureFPS = () => {
                    frameCount++;
                    if (performance.now() - startTime < 1000) {
                        window.requestAnimationFrame(measureFPS);
                    } else {
                        done({ fps: frameCount });
                    }
                };

                window.requestAnimationFrame(measureFPS);
            }, [], function(result) {
                browser.assert.ok(result.value.fps >= 60, `FPS with 10 ants should be >= 60 (Measured: ${result.value.fps})`);
            })

            // Add 30 ants (total) and measure FPS
            .execute(function() {
                const antsController = window.canvasController.ants;
                for (let i = 0; i < 20; i++) {
                    antsController.ants.push({ model: new AntM(antsController.canvas, antsController.map), view: new AntV(antsController.canvas, antsController.map.cellSize) });
                }
            })
            .pause(2000)
            .executeAsync(function(done) {
                let frameCount = 0;
                const startTime = performance.now();

                const measureFPS = () => {
                    frameCount++;
                    if (performance.now() - startTime < 1000) {
                        window.requestAnimationFrame(measureFPS);
                    } else {
                        done({ fps: frameCount });
                    }
                };

                window.requestAnimationFrame(measureFPS);
            }, [], function(result) {
                browser.assert.ok(result.value.fps >= 30, `FPS with 30 ants should be >= 30 (Measured: ${result.value.fps})`);
            })

            .end();
    });
});
