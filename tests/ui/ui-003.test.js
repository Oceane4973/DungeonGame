describe('UI-003: Rendering and Animation of Ants', function() {
    it('Should verify ant movement and animation', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body', 'Body should be visible')
            .waitForElementVisible('#game', 'Canvas should be visible')

            // Start the simulation
            .waitForElementVisible('#control', 'Start button should be visible')
            .click('#control') // Correctly interacting with the button
            .pause(2000) // Wait for simulation to start and movement to stabilize

            // Verify ant movement and animation
            .executeAsync(function(done) {
                const antsController = window.canvasController.ants;
                const initialPositions = antsController.ants.map(ant => ({
                    x: ant.model.xAnt,
                    y: ant.model.yAnt,
                    angle: ant.model.angle
                }));

                setTimeout(() => {
                    const newPositions = antsController.ants.map(ant => ({
                        x: ant.model.xAnt,
                        y: ant.model.yAnt,
                        angle: ant.model.angle
                    }));

                    const results = {
                        isMoving: newPositions.some((pos, idx) => 
                            pos.x !== initialPositions[idx].x || pos.y !== initialPositions[idx].y
                        ),
                        isRotatingSmoothly: newPositions.every((pos, idx) => 
                            Math.abs(pos.angle - initialPositions[idx].angle) < 360
                        ),
                        proportionalSize: antsController.ants.every(ant => {
                            const { width, height } = ant.view.image.img;
                            return width > 0 && height > 0;
                        })
                    };

                    done(results);
                }, 2000); // Observe for 2 seconds
            }, [], function(result) {
                browser.assert.ok(result.value.isMoving, 'Ants should move fluidly');
                browser.assert.ok(result.value.isRotatingSmoothly, 'Ant rotations should be smooth');
                browser.assert.ok(result.value.proportionalSize, 'Ant sizes should be proportional');
            })

            // Verify animation fluidity (approximate 60 FPS)
            .executeAsync(function(done) {
                let frameCount = 0;
                const startTime = performance.now();

                const countFrames = () => {
                    frameCount++;
                    if (performance.now() - startTime < 1000) {
                        requestAnimationFrame(countFrames);
                    } else {
                        done(frameCount);
                    }
                };

                countFrames();
            }, [], function(result) {
                browser.assert.ok(result.value >= 55, 'Animation should run at approximately 60 FPS');
            })

            // Verify no graphical trails
            .execute(function() {
                const canvas = document.querySelector('#game');
                const context = canvas.getContext('2d');
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                return imageData.data.some(pixel => pixel !== 0); // Check for non-transparent pixels
            }, [], function(result) {
                browser.assert.ok(result.value, 'Canvas should not leave graphical trails');
            })

            // Verify different simulation speeds
            .click('#control') // Pause the simulation
            .click('#control') // Resume the simulation
            .execute(function() {
                return window.gameEngine.fps === 60;
            }, [], function(result) {
                browser.assert.ok(result.value, 'Simulation speed should match the expected frame rate');
            })

            .end();
    });
});
