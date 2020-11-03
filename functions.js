/** @format */

const axios = require("axios");
exports.createUser = async ctx => {
	try {
		if (ctx.message.chat.username) {
			await UserModel.create({
				name: ctx.message.chat.username,
				nameReal: ctx.message.chat.first_name,
				UserId: ctx.message.chat.id,
			});
		} else {
			await UserModel.create({
				nameReal: ctx.message.chat.first_name,
				UserId: ctx.message.chat.id,
			});
		}
	} catch (err) {
		ctx.reply("Случилась ошибка");
		console.log(err);
	}
};

let findUser = async ctx => {
	let user = await UserModel.find({ name: ctx.message.chat.username });
	return user;
};

let sendprice = async ctx => {
	// let price = await functions.getPrice('https://cointelegraph.com/bitcoin-price-index')
	// return price ;
	let user = await UserModel.find({ name: ctx.message.chat.username });

	interval = setInterval(() => {
		if (user[0].receiveData === true) {
			ctx.reply("1 bitcoin = " + btc.kurs + "    Время : " + btc.time);
		} else {
			ctx.reply("вы не получаете курсов");
			clearInterval(interval);
		}
	}, 30 * 1000);
};

const UserModel = require("./UserModel.js");
exports.saveMessages = async ctx => {
	try {
		let user = await UserModel.find({ UserId: ctx.message.chat.id });

		if (user[0].messages) {
			let messages =
				ctx.message.text + " " + Date.now() + "###" + user[0].messages;
			await UserModel.findOneAndUpdate(
				{ UserId: ctx.message.chat.id },
				{ messages: messages },
				{
					new: true,
					runValidators: true,
				}
			);
		} else {
			let messages = ctx.message.text + " " + Date.now();
			await UserModel.findOneAndUpdate(
				{ UserId: ctx.message.chat.id },
				{ messages: messages },
				{
					new: true,
					runValidators: true,
				}
			);
		}
	} catch (err) {
		ctx.reply("error occured");
	}
};

exports.setSched = async ctx => {
	// if( schedule.scheduledJobs[ctx.message.chat.username]!==undefined|| schedule.scheduledJobs[ctx.message.chat.id]!==undefined){
	if (
		schedule.scheduledJobs[ctx.message.chat.username] == undefined &&
		schedule.scheduledJobs[ctx.message.chat.id] == undefined
	) {
		try {
			if (ctx.message.chat.username) {
				var j = schedule.scheduleJob(
					ctx.message.chat.username,
					"*/5 * * * * *",
					function () {
						ctx.reply("1 bitcoin = " + btc.kurs + "    Время : " + btc.time);
					}
				);
			} else {
				var j = schedule.scheduleJob(
					ctx.message.chat.id,
					"*/5 * * * * *",
					function () {
						ctx.reply("1 bitcoin = " + btc.kurs + "    Время : " + btc.time);
					}
				);
			}
		} catch (err) {
			console.log(err);
		}
	} else {
	}
};
exports.stopCheck = async ctx => {
	if (
		schedule.scheduledJobs[ctx.message.chat.username] !== undefined ||
		schedule.scheduledJobs[ctx.message.chat.id] !== undefined
	) {
		if (ctx.message.chat.username) {
			schedule.scheduledJobs[ctx.message.chat.username].cancel();
		} else {
			schedule.scheduledJobs[ctx.message.chat.id].cancel();
		}
	} else {
		ctx.reply("Вы все еще не получаете курсы биткоина");
	}
};

exports.setSched = async ctx => {
	// if( schedule.scheduledJobs[ctx.message.chat.username]!==undefined|| schedule.scheduledJobs[ctx.message.chat.id]!==undefined){
	if (
		schedule.scheduledJobs[ctx.message.chat.username] == undefined &&
		schedule.scheduledJobs[ctx.message.chat.id] == undefined
	) {
		try {
			if (ctx.message.chat.username) {
				var j = schedule.scheduleJob(
					ctx.message.chat.username,
					"*/5 * * * * *",
					function () {
						ctx.reply("1 bitcoin = " + btc.kurs + "    Время : " + btc.time);
					}
				);
			} else {
				var j = schedule.scheduleJob(
					ctx.message.chat.id,
					"*/5 * * * * *",
					function () {
						ctx.reply("1 bitcoin = " + btc.kurs + "    Время : " + btc.time);
					}
				);
			}
		} catch (err) {
			console.log(err);
		}
	} else {
	}
};
exports.stopCheck = async ctx => {
	if (
		schedule.scheduledJobs[ctx.message.chat.username] !== undefined ||
		schedule.scheduledJobs[ctx.message.chat.id] !== undefined
	) {
		if (ctx.message.chat.username) {
			schedule.scheduledJobs[ctx.message.chat.username].cancel();
		} else {
			schedule.scheduledJobs[ctx.message.chat.id].cancel();
		}
	} else {
		ctx.reply("Вы все еще не получаете курсы биткоина");
	}
};
exports.addPhone = async ctx => {
	await UserModel.findOneAndUpdate(
		{ UserId: ctx.message.chat.id },
		{ phoneNum: ctx.message.contact.phone_number },
		{
			new: true,
			runValidators: true,
		}
	);
};
