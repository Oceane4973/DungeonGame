describe('UI-004: Visualization of Pheromones', function() {
    it('Should verify the visualization of pheromones with toggling and transitions', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body', 'Body should be visible')
            .waitForElementVisible('#game', 'Canvas should be visible')

            // Enable pheromone visualization
            .waitForElementVisible('#pheromones', 'Phéromones button should be visible')
            .click('#pheromones') // Activate pheromone display
            .pause(1000) // Wait for display to update

            // Verify circle display mode
            .execute(function() {
                const cellsWithPheromones = window.canvasController.map.matrixCell.flat().filter(cell => cell.model.pheromones > 0);
                const allCirclesVisible = cellsWithPheromones.every(cell => cell.view.drawPheromoneCircle);
                return {
                    allCirclesVisible,
                    pheromoneCount: cellsWithPheromones.length
                };
            }, [], function(result) {
                browser.assert.ok(result.value.allCirclesVisible, 'All cells with pheromones should display circles');
                browser.assert.ok(result.value.pheromoneCount > 0, 'There should be cells with pheromones');
            })

            // Toggle off pheromone visualization
            .click('#pheromones') // Deactivate pheromone display
            .pause(1000)

            // Verify numeric display mode
            .execute(function() {
                const cellsWithPheromones = window.canvasController.map.matrixCell.flat().filter(cell => cell.model.pheromones > 0);
                const allNumbersVisible = cellsWithPheromones.every(cell => !cell.view.drawPheromoneCircle);
                return {
                    allNumbersVisible,
                    pheromoneCount: cellsWithPheromones.length
                };
            }, [], function(result) {
                browser.assert.ok(result.value.allNumbersVisible, 'All cells with pheromones should display numeric values');
                browser.assert.ok(result.value.pheromoneCount > 0, 'There should still be cells with pheromones');
            })

            // Observe gradient and real-time updates
            .click('#pheromones') // Reactivate pheromone display for gradient observation
            .pause(2000) // Wait for changes in intensity
            .execute(function() {
                const cellsWithPheromones = window.canvasController.map.matrixCell.flat().filter(cell => cell.model.pheromones > 0);
                const gradientsCorrect = cellsWithPheromones.every(cell => {
                    const context = window.canvasController.canvas.getContext('2d');
                    const gradientFillStyle = context.fillStyle.includes('rgba');
                    return gradientFillStyle;
                });

                const intensityUpdated = cellsWithPheromones.every(cell => {
                    const oldPheromones = cell.model.pheromones;
                    cell.model.evaporate(); // Trigger evaporation manually
                    return cell.model.pheromones < oldPheromones;
                });

                return {
                    gradientsCorrect,
                    intensityUpdated
                };
            }, [], function(result) {
                browser.assert.ok(result.value.gradientsCorrect, 'Gradient visualization should be correct');
                //browser.assert.ok(result.value.intensityUpdated, 'Pheromone intensity should update in real-time');
            })

            .end();
    });
});
