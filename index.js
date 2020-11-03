/** @format */

"use strict";
const fs = require("fs");
var schedule = require("node-schedule");
const functions = require("./functions.js");
const UserModel = require("./UserModel.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const app = express();
dotenv.config({ path: "./configuration.env" });
const db = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(console.log("success"));
var btc;
btc = { kurs: "asd", time: "sd" };
const { Telegraf } = require("telegraf");
const cheerio = require("cheerio");
const { CronJob } = require("cron");
const bot = new Telegraf("your token ");

const axios = require("axios");
setInterval(() => {
	axios
		.get("https://botinvoker.df.r.appspot.com/")
		.then(function (response) {
			// handle success
			console.log(response);
			``;
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		})
		.then(function () {
			// always executed
		});
}, 300 * 1000);

function requestBtc(time) {
	try {
		setInterval(() => {
			axios
				.get("https://api.coindesk.com/v1/bpi/currentprice.json")
				.then(function (response) {
					// handle success
					let finalObj = {
						kurs: response.data.bpi.USD.rate,
						time: response.data.time.updated,
					};
					btc = finalObj;
				});
		}, time);
	} catch (err) {
		console.log(error);
	}
}
requestBtc(5000);

let intervalsArr = [[]];
// console.log(arr[0].filter(e=>e>3))
let startMsg = (ctx, time, btn) => {
	let arrIndex;

	for (let i = 0; i < intervalsArr.length; i++) {
		if (
			intervalsArr[i].filter(el => el == ctx.message.chat.id)[0] !== undefined
		) {
			arrIndex = i;
			break;
		}
	}
	if (arrIndex) {
		if (intervalsArr[arrIndex][1]._destroyed === false) {
			ctx.reply("Вы уже получаете курсы ");
		} else {
			intervalsArr[arrIndex][1] = setInterval(() => {
				ctx.reply("1 bitcoin = " + btc.kurs + " USD    Время : " + btc.time);
			}, time * 1000*3600);
		}
	} else {
		intervalsArr.push([1, 2]);
		intervalsArr[intervalsArr.length - 1][0] = ctx.message.chat.id;
		intervalsArr[intervalsArr.length - 1][1] = setInterval(() => {
			ctx.reply("1 bitcoin = " + btc.kurs + " USD    Время : " + btc.time);
		}, time * 1000*3600);
	}
};

let StopMsg = ctx => {
	let arrIndex;
	try {
		for (let i = 0; i < intervalsArr.length; i++) {
			if (
				intervalsArr[i].filter(el => el == ctx.message.chat.id)[0] !== undefined
			) {
				arrIndex = i;
				break;
			}
		}

		if (intervalsArr[arrIndex][1]._destroyed === true) {
			ctx.reply("Вы не получаете курсы ");
		} else if (intervalsArr[arrIndex][1]._destroyed === false) {
			clearInterval(intervalsArr[arrIndex][1]);
		} else if (!arrIndex) {
			ctx.reply("Установите время получения курсов ");
		}
	} catch (err) {
		ctx.reply("Нажмите на кнопку , чтобы получать курсы");
	}
};

bot.launch();
bot.start(ctx => {
	var option = {
		parse_mode: "Markdown",
		reply_markup: {
			one_time_keyboard: true,
			keyboard: [
				[
					{
						text: "Номер телефона",
						request_contact: true,
					},
				],
			],
		},
	};
	ctx.reply(
		'Здравствуйте, Вам нужно зарегестрироваться в нашем боте, нажмите на кнопку " Номер телефона" .Чтобы получать курсы биткоина ',
		option
	);

	functions.createUser(ctx);
});

bot.on("contact", ctx => {
	functions.addPhone(ctx);
	let options = {
		reply_markup: {
			one_time_keyboard: false,
			keyboard: [
				[
					{
						text: "Start",
					},
				],
				[{ text: "Stop" }],
			],
		},
	};

	let option = {
		reply_markup: {
			one_time_keyboard: true,
			keyboard: [
				[
					{
						text: "раз в 1 час ",
					},
				],
				[{ text: "раз в 3 часа" }],
				[{ text: "раз в 6 часов" }],
				[{ text: "раз в 12 часов часа" }],
				[{ text: "раз в 24 часа" }],
				[
					{
						text: "Узнать курс сейчас",
					},
				],
			],
		},
	};
	ctx.reply(
		'Спасибо! Установите, пожалуйста, частоту получения курсов, нажав соответствующую кнопку. Для прекращения - отправьте сообщение со словом "stop".',
		option
	);
});
("Спасибо, Нажмите на кнопку старт ,чтобы начать получать курсы биткоина и на кнопку стоп ,чтобы перестать");
async function deleteall(ctx) {
	await UserModel.findOneAndDelete({ id: ctx.message.chat.id });
}

bot.on("text", ctx => {
	let options = {
		reply_markup: {
			one_time_keyboard: true,
			keyboard: [
				[
					{
						text: "Stop",
					},
				],
			],
		},
	};
	functions.saveMessages(ctx, schedule);

	if (ctx.message.text === "Stop") {
		try {
			let option = {
				reply_markup: {
					one_time_keyboard: true,
					keyboard: [
						[
							{
								text: "раз в 1 час ",
							},
						],
						[{ text: "раз в 3 часа" }],
						[{ text: "раз в 6 часов" }],
						[{ text: "раз в 12 часов часа" }],
						[{ text: "раз в 24 часа" }],
						[
							{
								text: "Узнать курс сейчас",
							},
						],
					],
				},
			};
			StopMsg(ctx);
			ctx.reply(
				"Чтобы изменить время получения курсов нажмите на необходимую кнопку",
				option
			);
		} catch (err) {
			console.log(err);
			ctx.reply("sorry , error");
		}
	} else if (
		ctx.message.text == "узнать курс сейчас" ||
		ctx.message.text == "Узнать курс сейчас"
	) {
		let optionStop = {
			reply_markup: {
				one_time_keyboard: true,
				keyboard: [
					[
						{
							text: "Stop",
						},
					],
					[
						{
							text: "узнать курс сейчас",
						},
					],
				],
			},
		};
		let option = {
			reply_markup: {
				one_time_keyboard: true,
				keyboard: [
					[
						{
							text: "раз в 1 час ",
						},
					],
					[{ text: "раз в 3 часа" }],
					[{ text: "раз в 6 часов" }],
					[{ text: "раз в 12 часов часа" }],
					[{ text: "раз в 24 часа" }],
					[
						{
							text: "Узнать курс сейчас",
						},
					],
				],
			},
		};
		if (ctx.message.text == "Узнать курс сейчас") {
			ctx.reply(
				"1 bitcoin = " + btc.kurs + " USD   Время : " + btc.time,
				option
			);
		} else {
			ctx.reply(
				"1 bitcoin = " + btc.kurs + " USD   Время : " + btc.time,
				optionStop
			);
		}
	} else if (ctx.message.text.includes("раз в")) {
		try {
			let optionStop = {
				reply_markup: {
					one_time_keyboard: true,
					keyboard: [
						[
							{
								text: "Stop",
							},
						],
						[
							{
								text: "узнать курс сейчас",
							},
						],
					],
				},
			};
			if (ctx.message.text.includes("1")) {
				startMsg(ctx, 1);
				ctx.reply("Вы получаете курсы ", optionStop);
			} else if (ctx.message.text.includes("3")) {
				startMsg(ctx, 3, optionStop);
				ctx.reply("Вы получаете курсы ", optionStop);
			} else if (ctx.message.text.includes("6")) {
				startMsg(ctx, 6, optionStop);
				ctx.reply("Вы получаете курсы ", optionStop);
			} else if (ctx.message.text.includes("9")) {
				startMsg(ctx, 9, optionStop);
				ctx.reply("Вы получаете курсы ", optionStop);
			} else if (ctx.message.text.includes("12")) {
				startMsg(ctx, 12, optionStop);
				ctx.reply("Вы получаете курсы ", optionStop);
			} else if (ctx.message.text.includes("24")) {
				startMsg(ctx, 24, optionStop);
				ctx.reply("Вы получаете курсы ", optionStop);
			}
		} catch (err) {
			ctx.reply("sorry error");
			console.log(err);
		}
	} else {
	}
});
bot.launch();

app.listen(8080, () => console.log("server is listening"));
app.get("/", (req, res) => {
	res.status(200).send("<h1>This is telegram bot<h1>");
});
