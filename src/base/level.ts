import mongoose from "mongoose";
import { User } from "../@types/index";
import UserSchema from "../models/User";

export default class XP {
  static async setURL({ url }: { url: string }): Promise<typeof mongoose> {
    return mongoose.connect(url).catch((err: Error) => {
      throw err;
    });
  }

  static async generateRandomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  static async createUser(
    user: User
  ): Promise<
    mongoose.Document<unknown, any, User> &
      User & { _id: mongoose.Types.ObjectId }
  > {
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

  static async addXP({
    id,
    xp,
  }: {
    id: User["id"];
    xp: number;
  }): Promise<number> {
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

  static async AddLevel({
    id,
    level,
  }: {
    id: User["id"];
    level: number;
  }): Promise<number> {
    if (level < 0 || isNaN(level))
      throw new TypeError("The level is not a number.");

    const IsUser = await UserSchema.findOne({ id: id });
    if (!IsUser) return null;

    IsUser.level += parseInt(level.toString(), 10);
    IsUser.xp += Math.floor(Math.PI * level * Math.sqrt(IsUser.level) * 100);
    await IsUser.save().catch((err: Error) => {
      throw err;
    });

    return IsUser.level;
  }

  static async setXP({
    id,
    xp,
  }: {
    id: User["id"];
    xp: number;
  }): Promise<number> {
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

  static async setLevel({
    id,
    level,
  }: {
    id: User["id"];
    level: number;
  }): Promise<number> {
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

  static async subtractXP({
    id,
    xp,
  }: {
    id: User["id"];
    xp: number;
  }): Promise<number> {
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

  static async subtractLevel({
    id,
    level,
  }: {
    id: User["id"];
    level: number;
  }): Promise<number> {
    if (level < 0 || isNaN(level))
      throw new TypeError("The level is not a number.");

    const IsUser = await UserSchema.findOne({ id: id });
    if (!IsUser) throw new Error("The user does not exist.");
    IsUser.level -= parseInt(level.toString(), 10);
    IsUser.xp -= Math.floor(Math.PI * level * Math.sqrt(IsUser.level) * 100);
    await IsUser.save().catch((err: Error) => {
      throw err;
    });

    return IsUser.level;
  }

  static async getUser({
    id,
  }: {
    id: User["id"];
  }): Promise<
    mongoose.Document<unknown, any, User> &
      User & { _id: mongoose.Types.ObjectId }
  > {
    const IsUser = await UserSchema.findOne({ id: id });
    if (!IsUser) return null;

    return IsUser;
  }

  static async getLeaderboard({ limit }: { limit: number }): Promise<any[]> {
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

  static async xpFor({
    targetLevel,
  }: {
    targetLevel: number;
  }): Promise<number> {
    if (isNaN(targetLevel) || isNaN(parseInt(targetLevel.toString(), 10)))
      throw new TypeError("Target level should be a valid number.");
    if (targetLevel < 0)
      throw new RangeError("Target level should be a positive number.");
    return targetLevel * targetLevel * 100;
  }

  static async getRank({ id }: { id: User["id"] }): Promise<number> {
    const users = await UserSchema.find({}).sort({ level: -1 });
    if (!users) throw new Error("The leaderboard is empty.");
    let rank = 0;
    for (const user of users) {
      rank++;
      if (user.id === id) return rank;
    }
    return rank;
  }
}
