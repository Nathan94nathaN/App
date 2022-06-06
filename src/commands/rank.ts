import type { SlashCommand } from "../@types/index";
import { CommandInteraction } from "discord.js";
import { CanvasRenderingContext2D, createCanvas, loadImage } from "canvas";
import XP from "../base/level";

export const name: SlashCommand["name"] = "rank",
  category: SlashCommand["category"] = "general",
  cooldown: SlashCommand["cooldown"] = 2,
  data: SlashCommand["data"] = {
    name: "rank",
    description: "rank command",
    options: [{ type: 6, name: "user", description: "user to rank", required: false }],
  },
  execute: SlashCommand["execute"] = async (int: CommandInteraction) => {
    await int.deferReply();
    const opt = int.options.getUser("user") || int.user;
    XP.getUser(opt.id).then(async (user) => XP.xpFor(user?.level + 1 ?? 1).then(async (xp: any) => XP.getRank(user.id).then(async (rank) => {
      const canvas = createCanvas(1040, 330), ctx = canvas.getContext("2d");
      ctx.beginPath();
      const img = await loadImage(
        "https://imgs.search.brave.com/NNV2npnCvGuI4gfrk0KO6PlS83oNDJ7A0X2GmYlcRn0/rs:fit:1200:1080:1/g:ce/aHR0cHM6Ly9pbWFn/ZXMuaGRxd2FsbHMu/Y29tL2Rvd25sb2Fk/L3NtYWxsLW1lbW9y/eS1scC0yNTYweDEw/ODAuanBn"
      );
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.globalAlpha = 0.5;
      ctx.rect(30, 30, 980, 270);
      ctx.fillStyle = "#000000";
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.closePath();
      const avatar = await loadImage(opt.avatarURL({ format: "png", size: 2048 }));
      ctx.save();
      roundedImage(ctx, 65, 65, 200, 200, 100);
      ctx.clip();
      ctx.drawImage(avatar, 65, 65, 200, 200);
      ctx.restore();
      const username = opt.username.length > 8 ? opt.username.slice(0, 8).concat("...") : opt.username;
      ctx.font = "800 40px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(username, 300, 190);
      const correctX = ctx.measureText(username).width;
      ctx.font = "25px Arial";
      ctx.fillStyle = "#7b7d7f";
      ctx.fillText(`#${opt.discriminator}`, correctX + 315, 190);

      ctx.font = "30px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText("LEVEL", 700, 120);

      ctx.font = "800 70px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(user.level.toString(), 780, 120);

      ctx.font = "30px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText("RANK", 860, 120);

      ctx.font = "800 70px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(rank.toString(), 940, 120);

      ctx.font = "30px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`${kFormatter(user.xp) ? kFormatter(user.xp) : 0} ‎/‎ ${kFormatter(xp)}`, 900, 190);

      // progress bar
      roundRect(ctx, 300, 210, 661, 40, 20, "#484b4e", true);
      roundRect(ctx, 300, 210, (85 / xp) * (user.xp === 0 ? (user.xp = 5) : user.xp) * 7.7, 40, 20, "#e74fb4", false);

      await int.editReply({ files: [{ attachment: canvas.toBuffer(), name: "rank.png" }] });
    })));
  };

function roundedImage(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.closePath();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: string, stroke = false) {
  if (typeof radius === "undefined") radius = 5;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  if (stroke) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
  }

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

const kFormatter = (num: number) => {
  return Math.abs(num) > 999 ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + "k" : Math.sign(num) * Math.abs(num);
};