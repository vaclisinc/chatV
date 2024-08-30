const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
    // TODO: The entry point file described above
    entry: {
        home: { import: "./public/js/index", filename: "js/[name].bundle.js" },
        signin: { import: "./public/js/signin", filename: "js/[name].bundle.js" },
    },
    // TODO: The location of the build folder described above
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "js/bundle.js",
    },
    plugins: [
        new Dotenv({
            path: "./.env", // Path to .env file (this is the default)
            safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
        }),
    ],
    // Optional and for development only. This provides the ability to
    // map the built code back to the original source format when debugging.
    devtool: "eval-source-map",
};
