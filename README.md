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

Youtube.getInfo({url: 'https://www.youtube.com/watch?v=LUU58iwi7NQ'})
  .then(video => console.log(video));
  
  /* video
  { 
    videoDetails: {
      videoId: 'LUU58iwi7NQ',
      title: 'HAI CHÚNG TA | OFFICIAL MUSIC VIDEO | THÁI TRINH - QUANG ĐĂNG',
      lengthSeconds: '228',
      keywords: [
        'Thái Trinh- Quang Đăng',
        'Hai chúng ta',
        'hai chung ta',
        'mv hai chúng ta',
        'mv hai chung ta',
        'hai chúng ta thái trinh',
        'hai chung ta thai trinh',
        'mv hai chúng ta thái trinh',
        'mv hai chung ta thai trinh',
        'hai chúng ta offical',
        'hai chung ta offcial',
        'quang đăng',
        'hai chúng ta music video',
        'thai trinh quang dang',
        'thai trinh',
        'quang dang',
        'quang đăng thái trinh',
        'quang đang thai trinh',
        'hai chung ta thai trinh quang dang',
        'thai trinh va quang dang',
        'hai chung ta quang dang'
      ],
      channelId: 'UCqJPm_4RfFdk_LIsExZUYZA',
      isOwnerViewing: false,
      shortDescription: 'Ca khúc "Hai Chúng Ta" do chính tay Thái Trinh sáng tác như một món quà dành tặng cho Quang Đăng, để kỷ niệm chuyện tình yêu của cả hai. Đây là MV đầu tiên Đăng - Trinh đóng chung kể từ khi công khai tình cảm. Và qua bài hát này Trinh muốn nhắn nhủ rằng, trong chuyện tình yêu, cặp đôi nào cũng có những lúc cãi vã, giận hờn thậm chí là buông lời chia tay. Những lúc như thế, hãy luôn nhớ những lúc vui vẻ, hạnh phúc bên nhau mà bỏ qua những quan điểm cá nhân, thông cảm cho nhau để hiểu nhau và yêu nhau hơn. Trinh cũng muốn gửi lời đến bạn trai của mình nếu sau này có giận, mình sẽ đem bài này ra hát để anh hết giận. Chúc mọi người có những phút giây nghe nhạc thật tuyệt vời.\n' +
        '\n' +
        'MỌI NGƯỜI NHỚ SUBSCRIBE KÊNH CỦA THÁI TRINH ĐỂ XEM NGAY CÁC VIDEO MỚI NHẤT NHÉ.\n' +
        '► Subscribe: https://goo.gl/5759BC\n' +
        '\n' +
        '► Theo dõi thông tin của Thái Trinh tại:\n' +
        'Facebook: http://bit.ly/ThaiTrinhNg\n' +
        'Fanpage: http://bit.ly/ThaiTrinhOfficial\n' +
        '\n' +
        'Mọi người vui lòng không đăng tải lại video khi chưa được sự đồng ý của Thái Trinh nhé. Chân thành cảm ơn :x',
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
Since the youtube-stream-url binary is updated regularly, you can run `npm update` to check for and download any updates for it.		

## License

MIT © [Dang Dung](https://github.com/dangdungcntt)
