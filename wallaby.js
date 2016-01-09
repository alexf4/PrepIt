module.exports = function () {
    return {
        files: [
            '../*.js',
            'dbWork/*.js',
            'views/*.js',
            'models/*.js',
            'routes/*.js'
        ],

        tests: [
            'tests/*Spec.js'
        ],
        bootstrap: function (wallaby) {
            // wallaby.testFramework is jasmine/QUnit/mocha object
            wallaby.testFramework.ui('bdd');

            // you can access 'window' object in a browser environment,
            // 'global' object or require(...) something in node environment
        },


        env: {
            // use 'node' type to use node.js
            type: 'node'
        }
    };
};