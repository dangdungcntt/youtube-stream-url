const axios = require('axios');

const getInfo = async ({url}) => {

    let video_id = getVideoId({url});

    if (!video_id) return false;

    let ytApi = 'http://www.youtube.com/get_video_info';

    let response = await axios.get(ytApi, {
        params: {video_id}
    }).catch(err => ({data: false}));

    if (!response.data || response.data.indexOf('errorcode') > -1) return false;

    let video_info = response.data;

    let data = {};

    parse_str(video_info, data);

    let {
        url_encoded_fmt_stream_map,
        title, thumbnail_url, view_count, length_seconds,
        allow_embed, author
    } = data;

    let streamsMap = url_encoded_fmt_stream_map.split(',');

    let formats = [];

    for (let stream of streamsMap) {
        let format = {};
        parse_str(stream, format);

        formats.push(format);
    }

    return {
        video_id, title, thumbnail_url, view_count,
        length_seconds, allow_embed, author, formats
    }
};

const getVideoId = ({url}) => {
    let opts = {fuzzy: true};

    if (/youtu\.?be/.test(url)) {

        // Look first for known patterns
        let i;
        let patterns = [
            /youtu\.be\/([^#\&\?]{11})/,  // youtu.be/<id>
            /\?v=([^#\&\?]{11})/,         // ?v=<id>
            /\&v=([^#\&\?]{11})/,         // &v=<id>
            /embed\/([^#\&\?]{11})/,      // embed/<id>
            /\/v\/([^#\&\?]{11})/         // /v/<id>
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

const parse_str = (str, array) => {

    let strArr = String(str).replace(/^&/, '').replace(/&$/, '').split('&');
    let sal = strArr.length;
    let i;
    let j;
    let ct;
    let p;
    let lastObj;
    let obj;
    let undef;
    let chr;
    let tmp;
    let key;
    let value;
    let postLeftBracketPos;
    let keys;
    let keysLen;

    let _fixStr = function (str) {
        return decodeURIComponent(str.replace(/\+/g, '%20'))
    };

    let $global = (typeof window !== 'undefined' ? window : global);
    $global.$locutus = $global.$locutus || {};
    let $locutus = $global.$locutus;
    $locutus.php = $locutus.php || {};

    if (!array) {
        array = $global
    }

    for (i = 0; i < sal; i++) {
        tmp = strArr[i].split('=');
        key = _fixStr(tmp[0]);
        value = (tmp.length < 2) ? '' : _fixStr(tmp[1]);

        while (key.charAt(0) === ' ') {
            key = key.slice(1)
        }
        if (key.indexOf('\x00') > -1) {
            key = key.slice(0, key.indexOf('\x00'))
        }
        if (key && key.charAt(0) !== '[') {
            keys = [];
            postLeftBracketPos = 0;
            for (j = 0; j < key.length; j++) {
                if (key.charAt(j) === '[' && !postLeftBracketPos) {
                    postLeftBracketPos = j + 1
                } else if (key.charAt(j) === ']') {
                    if (postLeftBracketPos) {
                        if (!keys.length) {
                            keys.push(key.slice(0, postLeftBracketPos - 1))
                        }
                        keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
                        postLeftBracketPos = 0;
                        if (key.charAt(j + 1) !== '[') {
                            break
                        }
                    }
                }
            }
            if (!keys.length) {
                keys = [key]
            }
            for (j = 0; j < keys[0].length; j++) {
                chr = keys[0].charAt(j);
                if (chr === ' ' || chr === '.' || chr === '[') {
                    keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1)
                }
                if (chr === '[') {
                    break
                }
            }

            obj = array;
            for (j = 0, keysLen = keys.length; j < keysLen; j++) {
                key = keys[j].replace(/^['"]/, '').replace(/['"]$/, '');
                lastObj = obj;
                if ((key !== '' && key !== ' ') || j === 0) {
                    if (obj[key] === undef) {
                        obj[key] = {}
                    }
                    obj = obj[key]
                } else {
                    // To insert new dimension
                    ct = -1;
                    for (p in obj) {
                        if (obj.hasOwnProperty(p)) {
                            if (+p > ct && p.match(/^\d+$/g)) {
                                ct = +p
                            }
                        }
                    }
                    key = ct + 1
                }
            }
            lastObj[key] = value
        }
    }
};

module.exports = {
    getInfo,
    getVideoId
};


