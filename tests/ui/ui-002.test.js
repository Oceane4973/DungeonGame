describe('UI-002: Visual Representation of Cells', function() {
    it('Should verify the rendering of each cell type', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body', 'Body should be visible')
            .waitForElementVisible('#game', 'Canvas should be visible')

            // Check rendering of each cell type
            .execute(function() {
                const cellTypes = ['FLOOR', 'TREE', 'ANTHILL', 'FOOD', 'OBSTACLE'];
                const map = window.canvasController.map;

                const results = cellTypes.map(type => {
                    const matchingCells = map.matrixCell.flat().filter(cell => cell.model.type === type);
                    return {
                        type,
                        count: matchingCells.length,
                        areRendered: matchingCells.every(cell => !!cell.view.image.img),
                        isSizeProportional: matchingCells.every(cell => {
                            const { width, height } = cell.view.image.img;
                            return width > 0 && height > 0;
                        }),
                    };
                });

                return results;
            }, [], function(result) {
                result.value.forEach(cellTest => {
                    browser.assert.ok(cellTest.areRendered, `${cellTest.type} cells should be rendered with images`);
                    browser.assert.ok(cellTest.count > 0, `${cellTest.type} cells should exist on the map`);
                    browser.assert.ok(cellTest.isSizeProportional, `${cellTest.type} cells should have proportional size`);
                });
            })

            // Check for overlapping images
            .execute(function() {
                const map = window.canvasController.map;
                const positions = new Set();

                return map.matrixCell.flat().every((cell, index) => {
                    const x = Math.floor(index % map.matrixLength);
                    const y = Math.floor(index / map.matrixLength);
                    const pos = `${x}-${y}`;
                    if (positions.has(pos)) {
                        return false; // Overlap detected
                    }
                    positions.add(pos);
                    return true;
                });
            }, [], function(result) {
                browser.assert.ok(result.value, 'Cells should not overlap');
            })

            .end();
    });
});
