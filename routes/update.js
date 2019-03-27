var express = require('express');
var router = express.Router();
const Stats = require('../model/stats')
const StatsIG = require('../model/statsig')
const ipp = require('instagram-profile-picture');
var dateFormat = require('dateformat');
var today = new Date().toLocaleString({timeZone: "Asia/Bangkok"})
var yesterday = new Date(Date.now() - 86400000).toLocaleString({timeZone: "Asia/Bangkok"})
var nextday = new Date(Date.now() + 86400000).toLocaleString({timeZone: "Asia/Bangkok"})
const getToday = dateFormat(today, "yyyy-mm-dd");
const getYesterday = dateFormat(yesterday, "yyyy-mm-dd");
const getNexyday = dateFormat(nextday, "yyyy-mm-dd");
var cron = require('node-cron');
var cronnextday = require('node-cron');
var cronup = require('node-cron');
var cronpost = require('node-cron');
const urlMetadata = require('url-metadata');
const requestpm = require('request-promise');
const cheerio = require('cheerio');
const Pageres = require('pageres');
const AWS = require('aws-sdk');
const puppeteer = require('puppeteer');
var request = require('request');
var Twitter = require('twitter');
 
  var client = new Twitter({
    consumer_key: 'xxxx',
    consumer_secret: 'xx',
    access_token_key: 'x-xxx',
    access_token_secret: 'xxx'
  });
   
  const s3 = new AWS.S3({
      accessKeyId: 'xx',
      secretAccessKey: 'xxxx/x/Acd'
  });
  

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

  async function run() {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    
    await page.goto('https://khaminstats.herokuapp.com/');
        await timeout(10000)


    const screenshot = await page.screenshot({
        omitBackground: true,
        encoding: 'binary',
        clip: {
            x: 1,
            y: 1,
            width: 795,
            height: 720
          }
        
      });
    
    
     console.log('this is screenshot function!!!!')
    browser.close();
    return screenshot;
   // console.log(screenshot)
  }
  


router.get('/compare/', async (req, res, next) => {
    try {
        // const user = await getUserFromDb({ id: req.params.id })

        console.log('getToday'+getToday)
        console.log('getYesterday'+getYesterday)
        console.log('getNexyday'+getNexyday)

        var queryToday = getQuery(getToday);
        var queryYesterday = getQuery(getYesterday);

        var resultToday = await queryToday.exec();
        var resultYesterday = await queryYesterday.exec();

        var queryTodayIG = getQueryIG(getToday);
        var queryYesterdayIG = getQueryIG(getYesterday);

        var resultTodayIG = await queryTodayIG.exec();
        var resultYesterdayIG = await queryYesterdayIG.exec();


        var url = await ipp('khamin.bnk48official').then(user => {
            return user;
          });

        //var url = await getPicture();


        // console.log(resultIGToday + 'wwowowowoo');

        res.json([
            { id: 1, result: resultToday.stats - resultYesterday.stats, today: resultToday.stats, picture: url, resultig: resultTodayIG.stats - resultYesterdayIG.stats, todayig: resultTodayIG.stats,date :getToday }

        ]);

    } catch (e) {
        //this will eventually be handled by your error handling middleware
        next(e)
    }
})


function getQuery(date) {
    var query = Stats.findOne({ date: date });
    return query;
}


function getQueryIG(date) {
    var query = StatsIG.findOne({ date: date });
    return query;
}

// insert/update fb
router.post('/', (req, res) => {

    var query = { 'date': getToday };
    Stats.findOneAndUpdate(query, req.body, { upsert: true }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        console.log(req.body);
        return res.send("succesfully saved");
    });

});

//insertupdate ig

router.post('/ig', (req, res) => {

    var query = { 'date': getToday };
    StatsIG.findOneAndUpdate(query, req.body, { upsert: true }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        console.log(req.body);
        return res.send("succesfully saved");
    });


});


//fornextdaymidnightfb

router.post('/nextdayfb', (req, res) => {

    var query = { 'date': getNexyday };
    Stats.findOneAndUpdate(query, req.body, { upsert: true }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        console.log(req.body);
        return res.send("succesfully saved");
    });

});


//fornextdaymidnightig
router.post('/nextdayig', (req, res) => {

    var query = { 'date': getNexyday };
    StatsIG.findOneAndUpdate(query, req.body, { upsert: true }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        console.log(req.body);
        return res.send("succesfully saved");
    });


});



const gogo = async () => {

    return await urlMetadata('https://www.facebook.com/pg/bnk48official.khamin/community/').then(
        function (metadata) {
            //   console.log(metadata)

            const value = metadata.description;
            const value2 = value.substr(14, 6);
            const value3 = value2.replace(',', '');

            return parseInt(value3);

        },
        function (error) {
            console.log(error)
        })
}


const gogoig = async () => {
    const USERNAME = 'khamin.bnk48official';
    const BASE_URL = `https://www.instagram.com/${USERNAME}/`;

    let response = await requestpm(
        BASE_URL,
        {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
            'cache-control': 'max-age=0',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
        }
    );


    let $ = cheerio.load(response);

    let script = $('script').eq(4).html();

    let { entry_data:
        { ProfilePage:
            { [0]:
                { graphql: { user } } } } } = JSON.parse(/window\._sharedData = (.+);/g.exec(script)[1]);

    //console.log(user.edge_followed_by.count);
    return user.edge_followed_by.count;

}


cron.schedule('50 * * * *', () => {


    gogo().then(result => {
        const sum = result
       // console.log('sum' + sum);
    
        var USER_DATA = {
            "stats": sum,
        }
    
        var options = {
            method: 'POST',
            url: 'https://khaminstats.herokuapp.com/update',
            headers: {
                'Content-Type': 'application/json'
            },
            json: USER_DATA
    
        };
    
        request(options, callback);
    
    
        function callback(error, response, body) {
            if (!error) {
                var info = JSON.parse(JSON.stringify(body));
                console.log(info);
            }
            else {
                console.log('Error happened: ' + error);
            }
        }
    
    
    
    
    });

    
gogoig().then(result => {
    const sum = result
    // console.log('sum' + sum);

    var USER_DATA = {
        "stats": sum,
    }

    var options = {
        method: 'POST',
        url: 'https://khaminstats.herokuapp.com/update/ig',
        headers: {
            'Content-Type': 'application/json'
        },
        json: USER_DATA

    };

    request(options, callback);


    function callback(error, response, body) {
        if (!error) {
            var info = JSON.parse(JSON.stringify(body));
            console.log(info);
        }
        else {
            console.log('Error happened: ' + error);
        }
    }




});
    console.log('cron update!!');
});

cronnextday.schedule('58 23 * * *', () => {


    gogo().then(result => {
        const sum = result
       // console.log('sum' + sum);
    
        var USER_DATA = {
            "stats": sum,
        }
    
        var options = {
            method: 'POST',
            url: 'https://khaminstats.herokuapp.com/update/nextdayfb',
            headers: {
                'Content-Type': 'application/json'
            },
            json: USER_DATA
    
        };
    
        request(options, callback);
    
    
        function callback(error, response, body) {
            if (!error) {
                var info = JSON.parse(JSON.stringify(body));
                console.log(info);
            }
            else {
                console.log('Error happened: ' + error);
            }
        }
    
    
    
    
    });

    
gogoig().then(result => {
    const sum = result
    // console.log('sum' + sum);

    var USER_DATA = {
        "stats": sum,
    }

    var options = {
        method: 'POST',
        url: 'https://khaminstats.herokuapp.com/update/nextdayig',
        headers: {
            'Content-Type': 'application/json'
        },
        json: USER_DATA

    };

    request(options, callback);


    function callback(error, response, body) {
        if (!error) {
            var info = JSON.parse(JSON.stringify(body));
            console.log(info);
        }
        else {
            console.log('Error happened: ' + error);
        }
    }

//
//heel
});
    console.log('run nextday');
});


cronup.schedule('55 21 * * *', () => {

run().then(result => {

  
    const params = {
        Bucket: 'khaminstat', // pass your bucket name
        Key: 'stat2.jpg', // file will be saved as testBucket/contacts.csv
        Body: result,
        ContentType: 'image/jpg', 
        ACL: 'public-read'
    };

    


    s3.upload(params, function(s3Err, data) {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`)
    });

})

console.log('cron up to bucket')
});
//

cronpost.schedule('00 22 * * *', () => {

    run().then(result => {

  
        client.post('media/upload', {media: result}, function(error, media, response) {
      
            if (!error) {
          
              // If successful, a media object will be returned.
              console.log(media);
          
              // Lets tweet it
              var status = {
                status: '[Khamin Bnk48 Facebook & Instragram Growth Rate] ประจำวันที่ '+getToday+' \r\n\r\n' +
                '#khaminbnk48 #bnk48 #khaminbnk48stats',
                media_ids: media.media_id_string // Pass the media id string
              }
          
              client.post('statuses/update', status, function(error, tweet, response) {
                if (!error) {
                  console.log(tweet);
                }else{
                    console.log(error);
                
                }
              });
          
            }
          });
    
      })

    console.log('cron upload tw!')

});

module.exports = router;
