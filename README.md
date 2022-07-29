# youtube-stream-url

Get stream url from youtube video in node.js.

## Installation

With [npm](https://www.npmjs.com/) do:

``` sh
npm install youtube-stream-url
```

## Usage

``` js
const Youtube = require('youtube-stream-url');

Youtube.getInfo({url: 'https://www.youtube.com/watch?v=pJ7WN3yome4'}).then(video => console.log(video));
```

Full output

```js
{ 
    videoDetails: {
        videoId: 'pJ7WN3yome4',
        title: 'M1 Ultra Mac Studio - Benchmarks & Thermals (The TRUTH!)',
        lengthSeconds: '1165',
        keywords: [
        'mac studio',
        'mac',
        'apple',
        'apple mac',
        'apple mac studio',
        'mac studio benchmarks',
        'mac studio teardown',
        'mac studio perfornance',
        'mac studio vs',
        'm1 ultra',
        'm1 ultra chip',
        'm1 ultra mac studio',
        'm1 ultra vs m1 max',
        'm1 max vs m1 ultra',
        'm1 max vs m1 ultra mac studio',
        'm1 ultra vs m1 max mac studio',
        'mac studio vs macbook pro',
        'mac studio vs imac',
        'mac studio vs mac mini',
        'mac studio thermal throttle test',
        'mac studio benchmarks test',
        'mac studio watt metere',
        'mac studio max tech',
        'mac studio ultra'
        ],
        channelId: 'UCptwuAv0XQHo1OQUSaO6NHw',
        isOwnerViewing: false,
        shortDescription: '...',
        isCrawlable: true,
        thumbnail: { thumbnails: [Array] },
        averageRating: 4.9487238,
        allowRatings: true,
        viewCount: '1124295',
        author: 'Thái Trinh Official',
        isPrivate: false,
        isUnpluggedCorpus: false,
        isLiveContent: false
    },
    formats: [
        {
        url: 'https://r4---sn-8qj-i5ol7.googlevideo.com/videoplayback...',
        type: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
        itag: '22',
        quality: 'hd720'
        },
        ...
    ],
    liveData: { //For live video (videoDetails.isLiveContent == true)
        manifestUrl: 'https://manifest.googlevideo.com/...',
        data: {
            segments: [
                {
                    "isMasterPlaylist": true,
                    "streamInf": {
                        "bandwidth": 290288,
                        "codecs": [
                            "mp4a.40.5,avc1.42c00b"
                        ],
                        "resolution": 256,
                        "frameRate": 15,
                        "videoRange": "SDR",
                        "subtitles": "vtt",
                        "closedCaptions": "NONE"
                    },
                    "url": "https://manifest.googlevideo.com/api/manifest/hls_playlist/.../playlist/index.m3u8"
                },
                ...
            ],
            "media": {
                "SUBTITLES": {
                    "vtt": {
                        "en": {
                            "groupId": "vtt",
                            "uri": "https://manifest.googlevideo.com/...",
                            "type": "SUBTITLES",
                            "language": "en",
                            "name": "en",
                            "default": false,
                            "autoselect": "YES"
                        }
                    }
                }
            }
        }
    }
}
```

For live video, you can get HLS Stream URL via `liveData` field. `liveData.data` format is [m3u8-file-parser](https://npm.io/package/m3u8-file-parser) output of manifest file from `liveData.manifestUrl`.


### Update			
Since the youtube-stream-url binary is updated regularly, you can run `npm update` to check for and download any updates for it.		

## License

MIT © [Dang Dung](https://github.com/dangdungcntt)
