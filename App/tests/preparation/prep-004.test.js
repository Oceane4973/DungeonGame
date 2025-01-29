describe('PREP-004: Audio Files Loading Test', function() {
    const expectedAudio = [
        {
            name: 'crunch.mp3',
            path: 'src/resources/sounds/crunch.mp3'
        },
        {
            name: 'pop.mp3',
            path: 'src/resources/sounds/pop.mp3'
        }
    ];

    it('Step 1: Should verify audio files are accessible', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .execute(function(audioFiles) {
                return Promise.all(audioFiles.map(audio => {
                    return new Promise((resolve) => {
                        const audioElement = new Audio();
                        audioElement.addEventListener('loadeddata', () => {
                            resolve({
                                name: audio.name,
                                loaded: true,
                                duration: audioElement.duration
                            });
                        });
                        audioElement.addEventListener('error', () => {
                            resolve({
                                name: audio.name,
                                loaded: false,
                                error: audioElement.error
                            });
                        });
                        audioElement.src = `${audio.path}?t=${Date.now()}`;
                    });
                }));
            }, [expectedAudio], function(result) {
                const audioResults = result.value;
                audioResults.forEach(result => {
                    browser.verify.ok(result.loaded, `${result.name} should load successfully`);
                    browser.verify.ok(result.duration > 0, `${result.name} should have a duration`);
                });
            });
    });

    it('Step 2: Should verify audio loading in game context', function(browser) {
        browser
            .url('http://localhost:3000')
            .pause(2000)
            .execute(function() {
                const audioElements = document.querySelectorAll('audio');
                const audioContext = window.AudioContext || window.webkitAudioContext;
                
                return {
                    hasAudioElements: audioElements.length > 0,
                    hasAudioContext: typeof audioContext !== 'undefined',
                    audioSupported: typeof Audio !== 'undefined'
                };
            }, [], function(result) {
                browser.verify.ok(result.value.audioSupported, 'Audio should be supported');
                browser.verify.ok(result.value.hasAudioContext, 'AudioContext should be available');
            })
            .end();
    });
}); 