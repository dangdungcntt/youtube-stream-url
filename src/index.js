const axios = require('axios');
const M3U8FileParser = require('m3u8-file-parser');
const m3u8Parser = new M3U8FileParser();

const getRemoteFile = async (url) => {
    try {
        let { data } = await axios.get(url);
        return data;
    } catch (e) {
        return null;
    }
}

const resolvePlayerResponse = (watchHtml) => {
    if (!watchHtml) {
        return '';
    }

    let matches = watchHtml.match(/ytInitialPlayerResponse = (.*)}}};/);
    return matches ? matches[1] + '}}}' : '';
}

const resoleM3U8Link = (watchHtml) => {
    if (!watchHtml) {
        return null;
    }

    let matches = watchHtml.match(/hlsManifestUrl":"(.*\/file\/index\.m3u8)/)
    return matches ? matches[1] : null;
}

const buildDecoder = async (watchHtml) => {
    if (!watchHtml) {
        return null;
    }

    let jsFileUrlMatches = watchHtml.match(/\/s\/player\/[A-Za-z0-9]+\/[A-Za-z0-9_.]+\/[A-Za-z0-9_]+\/base\.js/);

    if (!jsFileUrlMatches) {
        return null;
    }

    let jsFileContent = await getRemoteFile(`https://www.youtube.com${jsFileUrlMatches[0]}`);

    let decodeFunctionMatches = jsFileContent.match(/function.*\.split\(\"\"\).*\.join\(\"\"\)}/);

    if (!decodeFunctionMatches) {
        return null;
    }

    let decodeFunction = decodeFunctionMatches[0];

    let varNameMatches = decodeFunction.match(/\.split\(\"\"\);([a-zA-Z0-9]+)\./);

    if (!varNameMatches) {
        return null;
    }

    let varDeclaresMatches = jsFileContent.match(new RegExp(`(var ${varNameMatches[1]}={[\\s\\S]+}};)[a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\.prototype`));

    if (!varDeclaresMatches) {
        return null;
    }

    return function (signatureCipher) {
        let params = new URLSearchParams(signatureCipher);
        let { s: signature, sp: signatureParam = 'signature', url } = Object.fromEntries(params);
        let decodedSignature = new Function(`
            "use strict";
            ${varDeclaresMatches[1]}
            return (${decodeFunction})("${signature}");
        `)();

        return `${url}&${signatureParam}=${encodeURIComponent(decodedSignature)}`;
    }
}

const getInfo = async ({ url, throwOnError = false }) => {

    let videoId = getVideoId({ url });

    if (!videoId) return false;

    let ytApi = 'https://www.youtube.com/watch';

    try {
        const response = await axios.get(ytApi, {
            params: { v: videoId }
        });

        if (!response || response.status != 200 || !response.data) {
            const error = new Error('Cannot get youtube video response')
            error.response = response;
            throw error;
        }

        let ytInitialPlayerResponse = resolvePlayerResponse(response.data);
        let parsedResponse = JSON.parse(ytInitialPlayerResponse);
        let streamingData = parsedResponse.streamingData || {};

        let formats = (streamingData.formats || []).concat(streamingData.adaptiveFormats || []);

        let isEncryptedVideo = !!formats.find(it => !!it.signatureCipher);

        if (isEncryptedVideo) {
            let decoder = await buildDecoder(response.data);

            if (decoder) {
                formats = formats.map(it => {
                    if (it.url || !it.signatureCipher) {
                        return it;
                    }

                    it.url = decoder(it.signatureCipher);
                    delete it.signatureCipher;
                    return it;
                });
            }
        }

        let result = {
            videoDetails: parsedResponse.videoDetails || {},
            formats: formats.filter(format => format.url)
        };

        if (result.videoDetails.isLiveContent) {
            try {
                let m3u8Link = resoleM3U8Link(response.data);
                if (m3u8Link) {
                    let m3u8FileContent = await getRemoteFile(m3u8Link);

                    m3u8Parser.read(m3u8FileContent);

                    result.liveData = {
                        manifestUrl: m3u8Link,
                        data: m3u8Parser.getResult()
                    };

                    m3u8Parser.reset();
                }
            } catch (e) {
                if (throwOnError) {
                    throw e;
                }
            }
        }

        return result;
    } catch (e) {
        if (throwOnError) {
            throw e;
        }

        return false;
    }
};

const getVideoId = ({ url }) => {
    let opts = { fuzzy: true };

    if (/youtu\.?be/.test(url)) {

        // Look first for known patterns
        let i;
        let patterns = [
            /youtu\.be\/([^#\&\?]{11})/, // youtu.be/<id>
            /\?v=([^#\&\?]{11})/, // ?v=<id>
            /\&v=([^#\&\?]{11})/, // &v=<id>
            /embed\/([^#\&\?]{11})/, // embed/<id>
            /\/v\/([^#\&\?]{11})/ // /v/<id>
        ];

        // If any pattern matches, return the ID
        for (i = 0; i < patterns.length; ++i) {
            if (patterns[i].test(url)) {
                return patterns[i].exec(url)[1];
            }
        }

        if (opts.fuzzy) {
            // If that fails, break it apart by certain characters and look
            // for the 11 character key
            let tokens = url.split(/[\/\&\?=#\.\s]/g);
            for (i = 0; i < tokens.length; ++i) {
                if (/^[^#\&\?]{11}$/.test(tokens[i])) {
                    return tokens[i];
                }
            }
        }
    }

    return null;
};

module.exports = {
    getInfo,
    getVideoId
};
