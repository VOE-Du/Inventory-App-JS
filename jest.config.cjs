/** @type {import("jest").Config} */
module.exports = {
    testEnvironment: "jsdom",
    testEnvironmentOptions: {
        url: "http://localhost/",
    },
    roots: ["<rootDir>/src/js"],
    testMatch: ["**/__tests__/**/*.test.js"],
    transform: {
        "^.+\\.js$": "babel-jest",
    },
    collectCoverage: true,
    collectCoverageFrom: [
        "src/js/**/*.js",
        "!src/js/app.js",
        "!src/js/__tests__/**/*.js",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80,
        },
    },
};
