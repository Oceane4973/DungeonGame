describe('PREP-006: CSS Styles Test', function() {
    it('Step 1: Should verify basic CSS styles are applied', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .execute(function() {
                const canvas = document.querySelector('#game');
                const computedStyle = canvas ? window.getComputedStyle(canvas) : null;
                return {
                    canvas: {
                        exists: !!canvas,
                        height: computedStyle ? computedStyle.height : null,
                        width: computedStyle ? computedStyle.width : null,
                        display: computedStyle ? computedStyle.display : null
                    },
                    hasStylesheet: document.querySelector('link[rel="stylesheet"]') !== null || 
                                 document.querySelector('style') !== null,
                    cssRules: Array.from(document.styleSheets).some(sheet => {
                        try {
                            return sheet.cssRules && sheet.cssRules.length > 0;
                        } catch (e) {
                            return false;
                        }
                    })
                };
            }, [], function(result) {
                const styles = result.value;
                browser.verify.ok(
                    styles.hasStylesheet || styles.cssRules,
                    'CSS should be loaded'
                );
                
                if (styles.canvas.exists) {
                    browser.verify.ok(
                        styles.canvas.width && styles.canvas.height,
                        'Canvas should have dimensions set'
                    );
                }
            });
    });

    it('Step 2: Should verify basic layout', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .execute(function() {
                const canvas = document.querySelector('#game');
                const computedStyle = window.getComputedStyle(canvas);
                
                // Calculer le ratio du canvas par rapport à la fenêtre
                const canvasRatio = canvas.offsetHeight / window.innerHeight;
                
                return {
                    dimensions: {
                        window: {
                            width: window.innerWidth,
                            height: window.innerHeight
                        },
                        canvas: {
                            width: canvas.offsetWidth,
                            height: canvas.offsetHeight
                        }
                    },
                    ratio: canvasRatio,
                    style: {
                        position: computedStyle.position,
                        display: computedStyle.display
                    }
                };
            }, [], function(result) {
                const layout = result.value;
                
                // Vérifier que le canvas a des dimensions non nulles
                browser.verify.ok(
                    layout.dimensions.canvas.width > 0,
                    'Canvas should have a width'
                );
                browser.verify.ok(
                    layout.dimensions.canvas.height > 0,
                    'Canvas should have a height'
                );
                
                // Vérifier que le ratio du canvas est raisonnable (entre 50% et 100% de la hauteur de la fenêtre)
                browser.verify.ok(
                    layout.ratio >= 0.5 && layout.ratio <= 1,
                    `Canvas height ratio (${(layout.ratio * 100).toFixed(1)}%) should be between 50% and 100% of window height`
                );
            })
            .end();
    });
}); 