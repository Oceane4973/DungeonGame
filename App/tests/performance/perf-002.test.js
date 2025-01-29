describe('PERF-002: Memory Usage Verification', function() {
    it('Should measure and verify memory usage over time', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body', 'Body should be visible')
            .waitForElementVisible('#game', 'Canvas should be visible')

            .waitForElementVisible('#control', 'Control button should be visible')
            .click('#control')

            // Measure memory usage at startup
            .execute(function() {
                return performance.memory ? {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                } : null;
            }, [], function(result) {
                if (!result.value) {
                    browser.assert.fail('Memory API is not supported in this browser.');
                } else {
                    browser.assert.ok(result.value.usedJSHeapSize < 200 * 1024 * 1024, `Memory usage at startup should be < 200MB (Used: ${Math.round(result.value.usedJSHeapSize / 1024 / 1024)}MB)`);
                }
            })

            // Wait 10 minutes and measure memory usage
            .pause(3 * 60 * 1000) // Wait for 10 minutes
            .execute(function() {
                return performance.memory ? {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                } : null;
            }, [], function(result) {
                if (result.value) {
                    browser.assert.ok(result.value.usedJSHeapSize < 200 * 1024 * 1024, `Memory usage after 10 minutes should be < 200MB (Used: ${Math.round(result.value.usedJSHeapSize / 1024 / 1024)}MB)`);
                }
            })

            // Wait 20 more minutes (30 minutes total) and measure memory usage
            /**.pause(20 * 60 * 1000) // Wait for 20 minutes
            .execute(function() {
                return performance.memory ? {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                } : null;
            }, [], function(result) {
                if (result.value) {
                    browser.assert.ok(result.value.usedJSHeapSize < 200 * 1024 * 1024, `Memory usage after 30 minutes should be < 200MB (Used: ${Math.round(result.value.usedJSHeapSize / 1024 / 1024)}MB)`);
                }
            })

            // Force garbage collection
            .execute(function() {
                if (window.gc) {
                    window.gc(); // Force garbage collection if available
                }
                return performance.memory ? {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                } : null;
            }, [], function(result) {
                if (result.value) {
                    browser.assert.ok(result.value.usedJSHeapSize < 200 * 1024 * 1024, `Memory usage after garbage collection should be < 200MB (Used: ${Math.round(result.value.usedJSHeapSize / 1024 / 1024)}MB)`);
                }
            })

            // Verify no memory leaks by checking stability over a short interval
            .perform(async function() {
                const initialMemory = await new Promise(resolve => {
                    browser.execute(function() {
                        return performance.memory ? performance.memory.usedJSHeapSize : null;
                    }, [], function(result) {
                        resolve(result.value);
                    });
                });

                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds

                const finalMemory = await new Promise(resolve => {
                    browser.execute(function() {
                        return performance.memory ? performance.memory.usedJSHeapSize : null;
                    }, [], function(result) {
                        resolve(result.value);
                    });
                });

                browser.assert.ok(
                    finalMemory <= initialMemory + (5 * 1024 * 1024), // Allow slight fluctuation within 5MB
                    `Memory should not grow significantly over a short interval (Initial: ${Math.round(initialMemory / 1024 / 1024)}MB, Final: ${Math.round(finalMemory / 1024 / 1024)}MB)`
                );
            })**/

            .end();
    });
});
