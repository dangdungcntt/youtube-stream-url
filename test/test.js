const Youtube = require('../src');

(async () => {
    console.log(await Youtube.getInfo({ url: 'https://www.youtube.com/watch?v=weRHyjj34ZE', throwOnError: true }))
})();