const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    embed: () => {
        return new MessageEmbed()
            .setColor("#99AAB5");
    },
    durationToMillis: (dur) => {
        return dur.split(":").map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    },
    millisToDuration: (ms) => {
        return prettyMilliseconds(ms, { colonNotation: true, secondsDecimalDigits: 0 });
    },
    chunk: (arr, size) => {
        const temp = [];
        for (let i = 0; i < arr.length; i += size) {
            temp.push(arr.slice(i, i + size));
        }
        return temp;
    },
    isValidURL: (url) => {
        return /^https?:\/\/((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
            .test(url);
    }
};
