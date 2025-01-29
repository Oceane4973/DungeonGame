describe('FUNC-003: Ant Generation and Limitation Test', function() {
    it('Step 1: Should verify ant generation rate and limitation', function(browser) {
        browser
            .url('http://localhost:3000')
            .waitForElementVisible('body')
            .waitForElementVisible('#game')
            .pause(1000)
            // Démarrer la simulation
            .click('#control')
            // Attendre que la simulation démarre vraiment
            .pause(3000)
            .execute(function() {
                if (!window.canvasController || !window.canvasController.ants) {
                    return { error: 'Ants controller not found' };
                }

                // Enregistrer le nombre initial de fourmis
                return {
                    initialCount: window.canvasController.ants.ants ? window.canvasController.ants.ants.length : 0,
                    error: null
                };
            })
            // Première vérification après 5 secondes
            .pause(5000)
            .execute(function() {
                const controller = window.canvasController;
                if (!controller || !controller.ants) return { error: 'Ants controller not found' };
                
                return {
                    currentCount: controller.ants.ants.length
                };
            }, [], function(result) {
                if (result.value.error) {
                    browser.assert.fail(result.value.error);
                    return;
                }

                // Vérifier que des fourmis ont commencé à être générées
                browser.verify.ok(
                    result.value.currentCount > 0,
                    `Should have started generating ants (current: ${result.value.currentCount})`
                );
            })
            // Vérification finale après un temps plus long
            .pause(20000)
            .execute(function() {
                const controller = window.canvasController;
                if (!controller || !controller.ants) return { error: 'Ants controller not found' };
                
                return {
                    finalCount: controller.ants.ants.length
                };
            }, [], function(result) {
                if (result.value.error) {
                    browser.assert.fail(result.value.error);
                    return;
                }

                // Vérifier que le nombre de fourmis ne dépasse pas 30
                browser.verify.ok(
                    result.value.finalCount <= 30,
                    `Ant count should not exceed 30 (current: ${result.value.finalCount})`
                );

                // Vérifier qu'il y a bien des fourmis générées
                browser.verify.ok(
                    result.value.finalCount > 0,
                    `Should have generated some ants (count: ${result.value.finalCount})`
                );
            })
            .end();
    });
});