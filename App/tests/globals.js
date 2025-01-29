const app = require('./server');
let server;

module.exports = {
    before: function(done) {
        server = app.listen(3000, () => {
            console.log('Test server started on port 3000');
            done();
        });
    },

    after: function(done) {
        if (server) {
            server.close(() => {
                console.log('Test server stopped');
                done();
            });
        } else {
            done();
        }
    }
};