const axios = require('axios');

const resolvePlayerResponse = (watchHtml) => {
    if (!watchHtml) {
        return '';
    }

    let matches = watchHtml.match(/ytInitialPlayerResponse = (.*)}}};/)
    return matches ? matches[1] + '}}}' : ''
}

const getInfo = async({ url }) => {

    let videoId = getVideoId({ url });

    if (!videoId) return false;

    let ytApi = 'https://www.youtube.com/watch';

    let response = await axios.get(ytApi, {
        params: { v: videoId }
    }).catch(err => ({ data: false }));

    if (!response.data || response.data.indexOf('errorcode') > -1) return false;

    try {
        let ytInitialPlayerResponse = resolvePlayerResponse(response.data);
        let parsedResponse = JSON.parse(ytInitialPlayerResponse);
        let streamingData = parsedResponse.streamingData || {}

        return {
            videoDetails: parsedResponse.videoDetails || {},
            formats: (streamingData.formats || []).concat(streamingData.adaptiveFormats || []).filter(format => format.url)
        }
    } catch {
        //Do nothing here
        return false
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