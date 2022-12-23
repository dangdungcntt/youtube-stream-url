var $gXNCa$axios = require("axios");
var $gXNCa$m3u8fileparser = require("m3u8-file-parser");



const $4fa36e821943b400$var$m3u8Parser = new $gXNCa$m3u8fileparser();
const $4fa36e821943b400$var$getRemoteFile = async (url)=>{
    try {
        let { data: data  } = await $gXNCa$axios.get(url);
        return data;
    } catch (e) {
        return null;
    }
};
const $4fa36e821943b400$var$resolvePlayerResponse = (watchHtml)=>{
    if (!watchHtml) return "";
    let matches = watchHtml.match(/ytInitialPlayerResponse = (.*)}}};/);
    return matches ? matches[1] + "}}}" : "";
};
const $4fa36e821943b400$var$resoleM3U8Link = (watchHtml)=>{
    if (!watchHtml) return null;
    let matches = watchHtml.match(/hlsManifestUrl":"(.*\/file\/index\.m3u8)/);
    return matches ? matches[1] : null;
};
const $4fa36e821943b400$var$buildDecoder = async (watchHtml)=>{
    if (!watchHtml) return null;
    let jsFileUrlMatches = watchHtml.match(/\/s\/player\/[A-Za-z0-9]+\/[A-Za-z0-9_.]+\/[A-Za-z0-9_]+\/base\.js/);
    if (!jsFileUrlMatches) return null;
    let jsFileContent = await $4fa36e821943b400$var$getRemoteFile(`https://www.youtube.com${jsFileUrlMatches[0]}`);
    let decodeFunctionMatches = jsFileContent.match(/function.*\.split\(\"\"\).*\.join\(\"\"\)}/);
    if (!decodeFunctionMatches) return null;
    let decodeFunction = decodeFunctionMatches[0];
    let varNameMatches = decodeFunction.match(/\.split\(\"\"\);([a-zA-Z0-9]+)\./);
    if (!varNameMatches) return null;
    let varDeclaresMatches = jsFileContent.match(new RegExp(`(var ${varNameMatches[1]}={[\\s\\S]+}};)[a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\.prototype`));
    if (!varDeclaresMatches) return null;
    return function(signatureCipher) {
        let params = new URLSearchParams(signatureCipher);
        let { s: signature , sp: signatureParam = "signature" , url: url  } = Object.fromEntries(params);
        let decodedSignature = new Function(`
            "use strict";
            ${varDeclaresMatches[1]}
            return (${decodeFunction})("${signature}");
        `)();
        return `${url}&${signatureParam}=${encodeURIComponent(decodedSignature)}`;
    };
};
const $4fa36e821943b400$var$getInfo = async ({ url: url , throwOnError: throwOnError = false  })=>{
    let videoId = $4fa36e821943b400$var$getVideoId({
        url: url
    });
    if (!videoId) return false;
    let ytApi = "https://www.youtube.com/watch";
    try {
        const response = await $gXNCa$axios.get(ytApi, {
            params: {
                v: videoId
            }
        });
        if (!response || response.status != 200 || !response.data) {
            const error = new Error("Cannot get youtube video response");
            error.response = response;
            throw error;
        }
        let ytInitialPlayerResponse = $4fa36e821943b400$var$resolvePlayerResponse(response.data);
        let parsedResponse = JSON.parse(ytInitialPlayerResponse);
        let streamingData = parsedResponse.streamingData || {};
        let formats = (streamingData.formats || []).concat(streamingData.adaptiveFormats || []);
        let isEncryptedVideo = !!formats.find((it)=>!!it.signatureCipher);
        if (isEncryptedVideo) {
            let decoder = await $4fa36e821943b400$var$buildDecoder(response.data);
            if (decoder) formats = formats.map((it)=>{
                if (it.url || !it.signatureCipher) return it;
                it.url = decoder(it.signatureCipher);
                delete it.signatureCipher;
                return it;
            });
        }
        let result = {
            videoDetails: parsedResponse.videoDetails || {},
            formats: formats.filter((format)=>format.url)
        };
        if (result.videoDetails.isLiveContent) try {
            let m3u8Link = $4fa36e821943b400$var$resoleM3U8Link(response.data);
            if (m3u8Link) {
                let m3u8FileContent = await $4fa36e821943b400$var$getRemoteFile(m3u8Link);
                $4fa36e821943b400$var$m3u8Parser.read(m3u8FileContent);
                result.liveData = {
                    manifestUrl: m3u8Link,
                    data: $4fa36e821943b400$var$m3u8Parser.getResult()
                };
                $4fa36e821943b400$var$m3u8Parser.reset();
            }
        } catch (e) {
            if (throwOnError) throw e;
        }
        return result;
    } catch (e1) {
        if (throwOnError) throw e1;
        return false;
    }
};
const $4fa36e821943b400$var$getVideoId = ({ url: url  })=>{
    let opts = {
        fuzzy: true
    };
    if (/youtu\.?be/.test(url)) {
        // Look first for known patterns
        let i;
        let patterns = [
            /youtu\.be\/([^#\&\?]{11})/,
            /\?v=([^#\&\?]{11})/,
            /\&v=([^#\&\?]{11})/,
            /embed\/([^#\&\?]{11})/,
            /\/v\/([^#\&\?]{11})/ // /v/<id>
        ];
        // If any pattern matches, return the ID
        for(i = 0; i < patterns.length; ++i){
            if (patterns[i].test(url)) return patterns[i].exec(url)[1];
        }
        if (opts.fuzzy) {
            // If that fails, break it apart by certain characters and look
            // for the 11 character key
            let tokens = url.split(/[\/\&\?=#\.\s]/g);
            for(i = 0; i < tokens.length; ++i){
                if (/^[^#\&\?]{11}$/.test(tokens[i])) return tokens[i];
            }
        }
    }
    return null;
};
module.exports = {
    getInfo: $4fa36e821943b400$var$getInfo,
    getVideoId: $4fa36e821943b400$var$getVideoId
};


//# sourceMappingURL=index.js.map
