"use strict";

var fs = require('fs');

var schedule = require('node-schedule');

var functions = require('./functions.js');

var UserModel = require('./UserModel.js');

var mongoose = require('mongoose');

var dotenv = require('dotenv');

var axios = require('axios');

dotenv.config({
  path: './configuration.env'
});
var db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(console.log('success'));
var btc;
btc = {
  kurs: "asd",
  time: 'sd'
};

var _require = require('telegraf'),
    Telegraf = _require.Telegraf;

var cheerio = require("cheerio");

var _require2 = require('cron'),
    CronJob = _require2.CronJob;

var bot = new Telegraf("your token");

function requestBtc(time) {
  try {
    setInterval(function () {
      axios.get("https://api.coindesk.com/v1/bpi/currentprice.json").then(function (response) {
        // handle success
        var finalObj = {
          kurs: response.data.bpi.USD.rate,
          time: response.data.time.updated
        };
        btc = finalObj;
      });
    }, time);
  } catch (err) {
    console.log(error);
  }
}

requestBtc(5000);

function parse(str) {
  var args = [].slice.call(arguments, 1),
      i = 0;
  return str.replace(/%s/g, function () {
    return args[i++];
  });
}

var setSched = function setSched(ctx, index) {
  try {
    // if( schedule.scheduledJobs[ctx.message.chat.username]!==undefined|| schedule.scheduledJobs[ctx.message.chat.id]!==undefined){
    if (schedule.scheduledJobs[ctx.message.chat.username] == undefined && schedule.scheduledJobs[ctx.message.chat.id] == undefined) {
      try {
        var arr = ["*/3 * * *", "*/6 * * *", "*/9 * * *", " */12 * * *", " */24 * * *"];
        var j = schedule.scheduleJob(ctx.message.chat.id + '', arr[index], function () {
          ctx.reply("1 bitcoin = " + btc.kurs + " USD    Время : " + btc.time);
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      ctx.reply('Вы уже получаете курсы');
    }
  } catch (err) {
    ctx.reply('Sorry some error happened');
    console.log(err);
  }
};

var setSched1 = function setSched1(ctx) {
  try {
    // if( schedule.scheduledJobs[ctx.message.chat.username]!==undefined|| schedule.scheduledJobs[ctx.message.chat.id]!==undefined){
    if (schedule.scheduledJobs[ctx.message.chat.username] == undefined && schedule.scheduledJobs[ctx.message.chat.id] == undefined) {
      try {
        var j = schedule.scheduleJob(ctx.message.chat.id + '', "*/59 * * * *", function () {
          ctx.reply("1 bitcoin = " + btc.kurs + " USD    Время : " + btc.time);
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      ctx.reply('Вы уже получаете курсы');
    }
  } catch (err) {
    ctx.reply('Sorry some error happened');
    console.log(err);
  }
};

var stopCheck = function stopCheck(ctx) {
  return regeneratorRuntime.async(function stopCheck$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            if (schedule.scheduledJobs[ctx.message.chat.id] !== undefined) {
              schedule.scheduledJobs[ctx.message.chat.id + ''].cancel();
              console.log(schedule.scheduledJobs);
              ctx.reply('Вы не получаете курсы');
            } else {
              ctx.reply('Вы все еще не получаете курсы биткоина');
            }
          } catch (err) {
            ctx.reply('sorry, error');
            console.log(err);
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

bot.launch();
bot.start(function (ctx) {
  var option = {
    "parse_mode": "Markdown",
    "reply_markup": {
      "one_time_keyboard": true,
      "keyboard": [[{
        text: "Номер телефона",
        request_contact: true
      }]]
    }
  };
  ctx.reply('Здравствуйте, Вам нужно зарегестрироваться в нашем боте, нажмите на кнопку " Номер телефона" .Чтобы получать курсы биткоина ', option);
  functions.createUser(ctx);
});
bot.on("contact", function (ctx) {
  functions.addPhone(ctx);
  var options = {
    reply_markup: {
      one_time_keyboard: false,
      keyboard: [[{
        text: "Start"
      }], [{
        text: 'Stop'
      }]]
    }
  };
  var option = {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [[{
        text: "раз в 1 час "
      }], [{
        text: 'раз в 3 часа'
      }], [{
        text: 'раз в 6 часов'
      }], [{
        text: 'раз в 12 часов часа'
      }], [{
        text: 'раз в 24 часа'
      }], [{
        text: "Узнать курс сейчас"
      }]]
    }
  };
  ctx.reply('Спасибо! Установите, пожалуйста, частоту получения курсов, нажав соответствующую кнопку. Для прекращения - отправьте сообщение со словом "stop".', option);
});
"Спасибо, Нажмите на кнопку старт ,чтобы начать получать курсы биткоина и на кнопку стоп ,чтобы перестать";

function deleteall(ctx) {
  return regeneratorRuntime.async(function deleteall$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOneAndDelete({
            id: ctx.message.chat.id
          }));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}

bot.on('text', function (ctx) {
  var options = {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [[{
        text: "Stop"
      }]]
    }
  };
  functions.saveMessages(ctx, schedule);

  if (ctx.message.text === "Stop") {
    try {
      var option = {
        reply_markup: {
          one_time_keyboard: true,
          keyboard: [[{
            text: "раз в 1 час "
          }], [{
            text: 'раз в 3 часа'
          }], [{
            text: 'раз в 6 часов'
          }], [{
            text: 'раз в 12 часов часа'
          }], [{
            text: 'раз в 24 часа'
          }], [{
            text: "Узнать курс сейчас"
          }]]
        }
      };
      stopCheck(ctx);
      ctx.reply('Чтобы изменить время получения курсов нажмите на необходимую кнопку', option);
    } catch (err) {
      ctx.reply('sorry , error');
    }
  } else if (ctx.message.text == "Узнать курс сейчас") {
    var _option = {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [[{
          text: "раз в 1 час "
        }], [{
          text: 'раз в 3 часа'
        }], [{
          text: 'раз в 6 часов'
        }], [{
          text: 'раз в 12 часов часа'
        }], [{
          text: 'раз в 24 часа'
        }], [{
          text: "Узнать курс сейчас"
        }]]
      }
    };
    ctx.reply("1 bitcoin = " + btc.kurs + " USD   Время : " + btc.time, _option);
  } else if (ctx.message.text == 'узнать курс сейчас') {
    var optionStop = {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [[{
          text: "Stop"
        }], [{
          text: "узнать курс сейчас"
        }]]
      }
    };
    ctx.reply("1 bitcoin = " + btc.kurs + " USD   Время : " + btc.time, optionStop);
  } else if (ctx.message.text == "Start") {} else if (ctx.message.text == 'delete' && ctx.message.chat.username == 'IzkakAdam') {
    deleteall(ctx);
  } else if (ctx.message.text.includes('раз в')) {
    try {
      var _optionStop = {
        reply_markup: {
          one_time_keyboard: true,
          keyboard: [[{
            text: "Stop"
          }], [{
            text: "узнать курс сейчас"
          }]]
        }
      };

      if (ctx.message.text.includes('1')) {
        setSched1(ctx);
      } else if (ctx.message.text.includes('3')) {
        setSched(ctx, 0);
      } else if (ctx.message.text.includes('6')) {
        setSched(ctx, 1);
      } else if (ctx.message.text.includes('9')) {
        setSched(ctx, 2);
      } else if (ctx.message.text.includes('24')) {
        setSched(ctx, 3);
      }

      ctx.reply("1 bitcoin = " + btc.kurs + " USD   Время : " + btc.time, _optionStop);
      ctx.reply('Вы получаете курсы ', _optionStop);
    } catch (err) {
      ctx.reply('sorry error');
    }
  } else {}
});
bot.launch();

var express = require('express');

var app = express();
app.listen(8080, function () {
  return console.log('server is listening');
});
app.get('/', function (req, res) {
  res.status(200).send("<h1>This is telegram bot<h1>");
});