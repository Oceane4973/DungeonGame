describe('PREP-007: Canvas Performance Test', function() {
    it('Step 1: Should measure initial FPS', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementPresent('#game')
            .execute(function() {
                return new Promise((resolve) => {
                    const fps = [];
                    let lastTime = performance.now();
                    let frames = 0;
                    
                    const measure = () => {
                        const now = performance.now();
                        frames++;
                        
                        if (now - lastTime >= 1000) {
                            fps.push(frames);
                            frames = 0;
                            lastTime = now;
                        }
                        
                        if (fps.length < 2) {
                            requestAnimationFrame(measure);
                        } else {
                            resolve({
                                fps: fps,
                                average: fps.reduce((a, b) => a + b, 0) / fps.length
                            });
                        }
                    };
                    
                    requestAnimationFrame(measure);
                });
            }, [], function(result) {
                console.log('FPS Measurements:', result.value);
                browser.assert.ok(result.value.average > 30, 'FPS should be above 30');
            });
    });

    it('Step 2: Should check memory usage', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementPresent('#game')
            .pause(2000)
            .execute(function() {
                if (window.performance && window.performance.memory) {
                    return {
                        totalJSHeapSize: window.performance.memory.totalJSHeapSize,
                        usedJSHeapSize: window.performance.memory.usedJSHeapSize,
                        jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit
                    };
                }
                return null;
            }, [], function(result) {
                if (result.value) {
                    console.log('Memory Usage:', result.value);
                    const memoryUsageRatio = result.value.usedJSHeapSize / result.value.jsHeapSizeLimit;
                    browser.assert.ok(memoryUsageRatio < 0.8, 'Memory usage should be below 80% of limit');
                }
            });
    });

    it('Step 3: Should test different grid sizes', function(browser) {
        const gridSizes = [10, 20, 30];
        
        gridSizes.forEach(size => {
            browser
                .url('http://localhost:3000')
                .waitForElementPresent('#game')
                .execute(function(gridSize) {
                    if (window.setGridSize) {
                        window.setGridSize(gridSize);
                    }
                    
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            if (window.performance && window.performance.memory) {
                                resolve({
                                    memory: window.performance.memory.usedJSHeapSize,
                                    gridSize: gridSize
                                });
                            } else {
                                resolve({ gridSize: gridSize });
                            }
                        }, 1000);
                    });
                }, [size], function(result) {
                    console.log(`Performance for grid size ${size}:`, result.value);
                    if (result.value.memory) {
                        browser.assert.ok(result.value.memory > 0, 'Memory usage should be measurable');
                    }
                });
        });

        browser.end();
    });
}); 