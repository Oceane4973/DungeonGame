describe('FUNC-002: Special Elements Placement Test', function() {
    it('Step 1: Should verify correct placement and quantity of special elements', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .waitForElementVisible('#game')
            .pause(1000) // Attendre l'initialisation
            .execute(function() {
                // Attendre que le canvasController soit disponible
                if (!window.canvasController) {
                    return { error: 'CanvasController not found. Please make sure it is exposed globally.' };
                }
                
                const map = window.canvasController.map;
                if (!map || !map.matrixCell) {
                    return { error: 'Matrix not initialized' };
                }
                
                // Compter les éléments dans la matrice
                const elements = {
                    ANTHILL: { count: 0, positions: [], quantity: 0 },
                    FOOD: { count: 0, positions: [], quantity: 0 },
                    OBSTACLE: { count: 0, positions: [] }
                };
                
                // Parcourir la matrice de cellules
                for (let y = 0; y < map.matrixCell.length; y++) {
                    for (let x = 0; x < map.matrixCell[y].length; x++) {
                        const cell = map.matrixCell[y][x];
                        const cellType = cell.model.type;
                        if (elements[cellType]) {
                            elements[cellType].count++;
                            elements[cellType].positions.push({x, y});
                            // Vérifier la quantité pour FOOD
                            if (cellType === 'FOOD' && cell.model.quantity !== undefined) {
                                elements.FOOD.quantity = cell.model.quantity;
                            }
                        }
                    }
                }
                
                // Vérifier l'accessibilité (algorithme de pathfinding simple)
                function isAccessible(start, end) {
                    const visited = new Set();
                    const queue = [start];
                    
                    while (queue.length > 0) {
                        const current = queue.shift();
                        const key = `${current.x},${current.y}`;
                        
                        if (current.x === end.x && current.y === end.y) return true;
                        if (visited.has(key)) continue;
                        
                        visited.add(key);
                        
                        // Vérifier les 4 directions
                        const directions = [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}];
                        for (const dir of directions) {
                            const newX = current.x + dir.x;
                            const newY = current.y + dir.y;
                            
                            if (newX >= 0 && newX < 20 && newY >= 0 && newY < 20) {
                                const cellType = map.matrixCell[newY][newX].model.type;
                                if (cellType !== 'TREE' && cellType !== 'OBSTACLE') {
                                    queue.push({x: newX, y: newY});
                                }
                            }
                        }
                    }
                    return false;
                }
                
                // Vérifier l'accessibilité de chaque source de nourriture
                const accessibility = elements.FOOD.positions.map(food => 
                    isAccessible(elements.ANTHILL.positions[0], food)
                );
                
                return {
                    elements: elements,
                    allFoodAccessible: accessibility.every(a => a),
                    foodCount: elements.FOOD.count,
                    obstacleCount: elements.OBSTACLE.count,
                    anthillCount: elements.ANTHILL.count,
                    foodQuantity: elements.FOOD.quantity
                };
            }, [], function(result) {
                if (result.value.error) {
                    browser.assert.fail(result.value.error);
                    return;
                }
                
                // Vérifier le nombre de fourmilières
                browser.verify.equal(
                    result.value.anthillCount,
                    1,
                    'Should have exactly one anthill'
                );
                
                // Vérifier le nombre de sources de nourriture
                browser.verify.ok(
                    result.value.foodCount >= 2 && result.value.foodCount <= 4,
                    `Should have 2-4 food sources (found ${result.value.foodCount})`
                );
                
                // Vérifier le nombre d'obstacles
                browser.verify.ok(
                    result.value.obstacleCount >= 1 && result.value.obstacleCount <= 2,
                    'Should have 1-2 obstacles'
                );
                
                // Vérifier l'accessibilité
                browser.verify.ok(
                    result.value.allFoodAccessible,
                    'All food sources should be accessible from the anthill'
                );

                // Vérifier la quantité initiale de nourriture
                browser.verify.equal(
                    result.value.foodQuantity,
                    1.0,
                    'Initial food quantity should be 1.0'
                );
            })
            .end();
    });
}); 