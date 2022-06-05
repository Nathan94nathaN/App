import mongoose from "mongoose";
import { User } from "../@types/index";
import UserSchema from "../models/User";

export default class XP {
  static async setURL(url: string) {
    return mongoose.connect(url).catch((err: Error) => {
      throw err;
    });
  }

  static async generateRandomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  static async createUser(user: User) {
    const isUser = await UserSchema.findOne({ id: user.id });
    if (isUser) throw new Error("The user already exists.");
    const newUser = new UserSchema(user);
    await newUser.save().catch((err: Error) => {
      throw err;
    });
    return newUser;
  }

  static async deleteUser(id: User["id"]) {
    const IsUser = await UserSchema.findOne({ id: id });
    if (!IsUser) return null;

    await UserSchema.findOneAndDelete({ id: id }).catch((err: Error) => {
      throw err;
    });

    return IsUser;
  }

  static async addXP(id: User["id"], xp: number) {
    if (xp < 0 || isNaN(xp)) throw new TypeError("The xp is not a number.");

    const IsUser = await UserSchema.findOne({ id: id });
    if (!IsUser) return null;

    IsUser.xp += parseInt(xp.toString(), 10);
    IsUser.level = Math.floor(0.1 * Math.sqrt(IsUser.xp));
    await IsUser.save().catch((err: Error) => {
      throw err;
    });

    return IsUser.xp;
  }

  static async AddLevel(id: User["id"], level: number) {
    if (level < 0 || isNaN(level))
      throw new TypeError("The level is not a number.");

    const IsUser = await UserSchema.findOne({ id: id });
    if (!IsUser) return null;

    IsUser.level += parseInt(level.toString(), 10);
    await IsUser.save().catch((err: Error) => {
      throw err;
    });

    return IsUser.level;
  }

  static async setXP(id: User["id"], xp: number) {
    if (xp < 0 || isNaN(xp)) throw new TypeError("The xp is not a number.");

    const IsUser = await UserSchema.findOne({ id: id });
    if (!IsUser) throw new Error("The user does not exist.");

    IsUser.xp = parseInt(xp.toString(), 10);
    IsUser.level = Math.floor(0.1 * Math.sqrt(IsUser.xp));
    await IsUser.save().catch((err: Error) => {
      throw err;
    });

    return IsUser.xp;
  }

  static async setLevel(id: User["id"], level: number) {
    if (level < 0 || isNaN(level))
      throw new TypeError("The level is not a number.");

    const IsUser = await UserSchema.findOne({ id: id });
    if (!IsUser) throw new Error("The user does not exist.");

    IsUser.level = parseInt(level.toString(), 10);
    await IsUser.save().catch((err: Error) => {
      throw err;
    });

    return IsUser.level;
  }

  static async subtractXP(id: User["id"], xp: number) {
    if (xp < 0 || isNaN(xp)) throw new TypeError("The xp is not a number.");

    const IsUser = await UserSchema.findOne({ id: id });
    if (!IsUser) throw new Error("The user does not exist.");

    IsUser.xp -= parseInt(xp.toString(), 10);
    IsUser.level = Math.floor(0.1 * Math.sqrt(IsUser.xp));
    await IsUser.save().catch((err: Error) => {
      throw err;
    });

    return IsUser.xp;
  }

  static async subtractLevel(id: User["id"], level: number) {
    if (level < 0 || isNaN(level))
      throw new TypeError("The level is not a number.");

    const IsUser = await UserSchema.findOne({ id: id });
    if (!IsUser) throw new Error("The user does not exist.");

    IsUser.level -= parseInt(level.toString(), 10);
    await IsUser.save().catch((err: Error) => {
      throw err;
    });

    return IsUser.level;
  }

  static async getUser(id: User["id"]) {
    const IsUser = await UserSchema.findOne({ id: id });
    if (!IsUser) return null;

    return IsUser;
  }

  static async getLeaderboard(limit: number) {
    const users = await UserSchema.find({}).sort({ xp: -1 }).limit(limit);
    if (!users) throw new Error("The leaderboard is empty.");
    const array = [];
    for (const user of users) {
      array.push({
        id: user.id,
        xp: user.xp,
        level: user.level,
      });
    }
    return array;
  }
}
