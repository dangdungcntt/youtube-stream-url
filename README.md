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

Youtube.getInfo({url: 'https://www.youtube.com/watch?v=J5yTcZ0OKlI'})
  .then(video => console.log(video));
  
  /* video
  { 
    video_id: 'J5yTcZ0OKlI',
    title: 'Báo chí quốc tế "cạn lời" với phong độ của U23 Việt Nam, lịch thi đấu trận chung kết với Uzbekistan',
    thumbnail_url: 'http://i.ytimg.com/vi/J5yTcZ0OKlI/default.jpg',
    view_count: '105114',
    length_seconds: '431',
    allow_embed: '1',
    author: 'Thể thao Việt Nam',
    formats: 
    [
      {
        url: 'https://r4---sn-8qj-i5ol7.googlevideo.com/videoplayback...',
        type: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
        itag: '22',
        quality: 'hd720'
       },
       ...
     ]
   }
  */
```

### Update

Since the youtube-stream-url binary is updated regularly, you can run `npm run update` to check for and download any updates for it.

## License

MIT © [Dang Dung](https://github.com/dangdungcntt)
