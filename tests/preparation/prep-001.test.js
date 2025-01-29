describe('PREP-001: Local Server Testing', function() {
    it('Step 1: Server should be accessible', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .assert.titleContains('Antman');
    });

    it('Step 2: Should load index.html correctly', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('#game')
            .execute(function() {
                return {
                    hasGame: !!document.querySelector('#game'),
                    title: document.title,
                    consoleErrors: window.consoleErrors || []
                };
            }, [], function(result) {
                browser.assert.equal(result.value.title, 'Antman', 'Page title should be correct');
                browser.assert.ok(result.value.hasGame, 'Game element should exist');
                browser.assert.ok(result.value.consoleErrors.length === 0, 'No console errors should be present');
            })
            .end();
    });
}); 