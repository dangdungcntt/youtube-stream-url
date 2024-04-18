const Youtube = require('..');

(async () => {
    console.log(await Youtube.getInfo({ url: process.argv[2], throwOnError: true }))
})();