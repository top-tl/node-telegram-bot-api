# toptl-node-telegram-bot-api

[node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) plugin for [TOP.TL](https://top.tl) — automatically post bot stats and check user votes.

## Installation

```bash
npm install toptl-node-telegram-bot-api toptl node-telegram-bot-api
```

## Usage

```ts
import TelegramBot from "node-telegram-bot-api";
import { TopTLClient } from "toptl";
import { createTopTLPlugin, hasVoted } from "toptl-node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN!, { polling: true });
const client = new TopTLClient(process.env.TOPTL_TOKEN!);

const plugin = createTopTLPlugin(client, "my_bot", bot, {
  autoPostInterval: 30 * 60 * 1000, // 30 minutes (default)
});

// Check if a user has voted
bot.onText(/\/voted/, async (msg) => {
  const voted = await hasVoted(client, "my_bot", msg.from!.id);
  bot.sendMessage(msg.chat.id, voted ? "Thanks for voting!" : "Please vote at https://top.tl/my_bot");
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoPostInterval` | `number` | `1800000` | Interval between auto-posts in ms |
| `autoPost` | `boolean` | `true` | Start auto-posting immediately |

## License

MIT
