/** @type {import("jest").Config} */
module.exports = {
    testEnvironment: "jsdom",
    roots: ["<rootDir>/src/js"],
    testMatch: ["**/__tests__/**/*.test.js"],
    transform: {
        "^.+\\.js$": "babel-jest",
    },
    collectCoverage: true,
    collectCoverageFrom: ["src/js/productValidation.js"],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80,
        },
    },
};
