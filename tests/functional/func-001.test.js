describe('FUNC-001: Grid Generation Test', function() {
    it('Step 1: Should generate a 20x20 grid with correct borders', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .waitForElementVisible('#game')
            .pause(1000)
            .execute(function() {
                const controller = window.canvasController;
                if (!controller || !controller.map) {
                    return { error: 'Map not found' };
                }

                const matrix = controller.map.matrixCell;
                const width = matrix[0].length;
                const height = matrix.length;

                // Vérifier les bordures
                let borderComplete = true;
                
                // Vérifier la première et dernière ligne
                for (let x = 0; x < width; x++) {
                    if (matrix[0][x].model.type !== 'TREE' && 
                        matrix[height-1][x].model.type !== 'TREE') {
                        borderComplete = false;
                        break;
                    }
                }

                // Vérifier la première et dernière colonne
                if (borderComplete) {
                    for (let y = 0; y < height; y++) {
                        if (matrix[y][0].model.type !== 'TREE' && 
                            matrix[y][width-1].model.type !== 'TREE') {
                            borderComplete = false;
                            break;
                        }
                    }
                }

                return {
                    width: width,
                    height: height,
                    borderComplete: borderComplete
                };
            }, [], function(result) {
                if (result.value.error) {
                    browser.assert.fail(result.value.error);
                    return;
                }

                // Vérifier les dimensions
                browser.verify.equal(
                    result.value.width,
                    20,
                    'Grid should be 20 cells wide'
                );
                browser.verify.equal(
                    result.value.height,
                    20,
                    'Grid should be 20 cells high'
                );

                // Vérifier les bordures
                browser.verify.ok(
                    result.value.borderComplete,
                    'All border cells should be trees'
                );
            })
            .end();
    });
});