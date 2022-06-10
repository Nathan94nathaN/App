import { Collection, DeleteResult, Document, InsertOneResult, UpdateResult, WithId } from "mongodb";

export default class XP {
  constructor(db: Collection) { this.db = db; }

  private db: Collection;

  public async generateRandomNumber({ min, max }: { min: number; max: number; }): Promise<number> { return Math.random() * (max - min) + min; }

  public async getUser({ userId }: { userId: string; }): Promise<WithId<Document> | null> { return await this.db.findOne({ id: userId }); }

  public async createUser({ userId }: { userId: string; }): Promise<InsertOneResult<Document>> {
    if (await this.getUser({ userId })) throw new Error("The user already exists.");
    return await this.db.insertOne({ id: userId, xp: 0, level: 1 });
  }

  public async deleteUser({ userId }: { userId: string; }): Promise<DeleteResult> {
    if (await this.getUser({ userId })) throw new Error("The user doesn't exists.");
    return await this.db.deleteOne({ id: userId })
  }

  public async addXP({ userId, xp }: { userId: string; xp: number; }): Promise<UpdateResult> {
    if (xp < 0) throw new TypeError("The xp is not a number.");
    const user = await this.getUser({ userId });
    if (!user) throw new Error("The user doesn't exists.");
    return await this.db.updateOne({ id: userId }, { $inc: { xp: parseInt(xp.toString()) }, $set: { level: Math.floor(0.1 * Math.sqrt(user["xp"])) } });
  }

  public async addLevel({ userId, level }: { userId: string; level: number; }): Promise<UpdateResult> {
    if (level < 0) throw new TypeError("The level is not a number.");
    const user = await this.getUser({ userId });
    if (!user) throw new Error("The user doesn't exists.");
    return await this.db.updateOne({ id: userId }, { $inc: { level: parseInt(level.toString()) }, $set: { level: user["level"] ** 2 * 100 } });
  }

  public async setXP({ userId, xp }: { userId: string; xp: number; }): Promise<UpdateResult> {
    if (xp < 0) throw new TypeError("The xp is not a number.");
    const user = await this.getUser({ userId });
    if (!user) throw new Error("The user doesn't exists.");
    return await this.db.updateOne({ id: userId }, { $set: { xp: parseInt(xp.toString()), level: Math.floor(0.1 * Math.sqrt(parseInt(xp.toString()))) } });
  }

  public async setLevel({ userId, level }: { userId: string; level: number; }): Promise<UpdateResult> {
    if (level < 0 || level > 100) throw new TypeError("The level is not a number.");
    const user = await this.getUser({ userId });
    if (!user) throw new Error("The user doesn't exists.");
    return await this.db.updateOne({ id: userId }, { $set: { level: parseInt(level.toString()) } });
  }

  public async subtractXP({ userId, xp }: { userId: string; xp: number; }): Promise<UpdateResult> {
    if (xp < 0) throw new TypeError("The xp is not a number.");
    const user = await this.getUser({ userId });
    if (!user) throw new Error("The user doesn't exists.");
    user["xp"] -= parseInt(xp.toString());
    user["level"] = Math.floor(0.1 * Math.sqrt(user["xp"]));
    if(user["xp"] < xp) user["xp"] = user["level"] = 0;
    return await this.db.updateOne({ id: userId }, { $set: { xp: user["xp"], level: user["level"] } })
  }

  public async subtractLevel({ userId, level }: { userId: string; level: number; }): Promise<UpdateResult> {
    if (level < 0) throw new TypeError("The level is not a number.");
    const user = await this.getUser({ userId });
    if (!user) throw new Error("The user doesn't exists.");
    user["level"] -= parseInt(level.toString());
    user["xp"] = user["level"] ** 2 * 100
    if(user["level"] < level) user["level"] = user["level"] = 0;
    return await this.db.updateOne({ id: userId }, { $set: { level: user["level"], xp: user["xp"] } })
  }

  public async getLeaderboard({ limit }: { limit: number; }): Promise<WithId<Document>[]> {
    const leaderboard = (await this.db.find().toArray()).sort((a, b) => b["level"] - a["level"] || b["xp"] - a["xp"]);
    return leaderboard.slice(0, limit) ?? [];
  }

  public xpFor({ targetLevel }: { targetLevel: number; }): number {
    if (isNaN(targetLevel) || isNaN(parseInt(targetLevel.toString()))) throw new TypeError("Target level should be a valid number.");
    if (targetLevel < 0) throw new RangeError("Target level should be a positive number.");
    return targetLevel ** 2 * 100;
  }

  public async getRank({ userId }: { userId: string; }): Promise<number> {
    const users = (await this.db.find().toArray()).sort((a, b) => b["level"] - a["level"] || b["xp"] - a["xp"]);
    return users.findIndex(user => user["id"] === userId) + 1;
  }
}