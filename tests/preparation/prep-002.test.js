describe('PREP-002: JavaScript Modules Loading Test', function() {
    it('Step 1: Should verify ES6 modules are supported', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .execute(function() {
                return {
                    hasModuleSupport: 'noModule' in HTMLScriptElement.prototype,
                    hasImportSupport: typeof HTMLScriptElement.supports === 'function' 
                        ? HTMLScriptElement.supports('module')
                        : 'noModule' in HTMLScriptElement.prototype
                };
            }, [], function(result) {
                browser.verify.ok(result.value.hasModuleSupport, 'Browser should support ES6 modules');
                browser.verify.ok(result.value.hasImportSupport, 'Browser should support module scripts');
            });
    });

    it('Step 2: Should verify module loading', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .execute(function() {
                return {
                    hasNoModuleErrors: !window.moduleLoadError,
                    moduleScripts: document.querySelectorAll('script[type="module"]').length > 0
                };
            }, [], function(result) {
                browser.verify.ok(result.value.moduleScripts, 'Page should contain module scripts');
                browser.verify.ok(result.value.hasNoModuleErrors, 'No module loading errors should occur');
            })
            .end();
    });
}); 