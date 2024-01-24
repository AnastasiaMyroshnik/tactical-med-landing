/* eslint-disable no-undef */
const path = require('path');
const express = require('express');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.SERVER_PORT;
const BOT_TOKEN = process.env.BOT_TOKEN;

const app = express();
const bot = new Telegraf(BOT_TOKEN)

app.use(express.static(DIST_DIR));

app.get('/handleForm', (req, res) => {
  try {
    const message = '🤩 Нова заявка на курс!\n\n'
      + `Ім\'я: ${req.query.name || '-'}\n`
      + `Телефон: ${req.query.phone || '-'}\n`
      + `Телеграм: ${req.query.telegram || '-'}\n`;
    bot.telegram.sendMessage(987200314, message);
    res.status(200).send('Ok');
  } catch(error) {
    console.error(error);
    res.status(500).send('Ok');
  }
})

app.get('/health', (req, res) => {
  res.send('здарова');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => console.log(`Started on PORT ${PORT}`));