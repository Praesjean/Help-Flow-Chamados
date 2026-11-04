module.exports = {
    testEnvironment: 'node',

    testMatch: [
        '**/tests/**/*.test.js'
    ],

    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/api/swagger/**'
    ],

    coverageDirectory: 'coverage',

    coverageReporters: [
        'text',
        'html',
        'lcov'
    ],

    clearMocks: true
};