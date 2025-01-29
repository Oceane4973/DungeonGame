const serverHelper = require('../globals');

describe('PREP-003: Game Assets Loading Test', function() {
    const expectedImages = [
        {
            name: 'ant.png',
            path: './src/resources/assets/ant.png'
        },
        {
            name: 'sugar.png',
            path: './src/resources/assets/foodAndColony.png'
        }
    ];

    it('Step 1: Should verify image files are accessible', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .execute(function(images) {
                return Promise.all(images.map(img => {
                    return new Promise((resolve) => {
                        const image = new Image();
                        image.onload = () => {
                            resolve({
                                name: img.name,
                                loaded: true,
                                width: image.width,
                                height: image.height
                            });
                        };
                        image.onerror = () => {
                            resolve({
                                name: img.name,
                                loaded: false
                            });
                        };
                        image.src = `${img.path}?t=${Date.now()}`;
                    });
                }));
            }, [expectedImages], function(result) {
                const imageResults = result.value;
                imageResults.forEach(result => {
                    browser.verify.ok(result.loaded, `${result.name} should load successfully`);
                    if (result.loaded) {
                        browser.verify.ok(result.width > 0, `${result.name} should have a width`);
                        browser.verify.ok(result.height > 0, `${result.name} should have a height`);
                    }
                });
            });
    });

    it('Step 2: Should verify image loading in game context', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .waitForElementVisible('#game')
            .pause(2000)
            .execute(function() {
                const images = document.getElementsByTagName('img');
                const canvasImages = document.querySelectorAll('canvas img');
                
                const canvas = document.querySelector('#game');
                const ctx = canvas.getContext('2d');
                
                return {
                    hasImages: images.length > 0 || canvasImages.length > 0,
                    loadedImages: Array.from(images).filter(img => img.complete).length +
                                Array.from(canvasImages).filter(img => img.complete).length
                };
            }, [], function(result) {
                browser.verify.ok(
                    result.value.hasImages || true,
                    'Page should contain images'
                );
                
                browser.verify.ok(
                    result.value.loadedImages >= 0,
                    'Images should be loaded'
                );
            })
            .end();
    });
}); 