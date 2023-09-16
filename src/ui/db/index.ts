import Dexie, { Table } from "dexie";

export class DBDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  tiktoks!: Table<TiktokAccount, string>;

  constructor() {
    super("myDatabase");
    this.version(2).stores({
      tiktoks:
        "uid, email, email_password, password, twoFaEnabled, payment, currency, secret, status",
    });
  }
  async addOrUpdateTiktok(item: TiktokAccount) {
    const isExisted = !!(await db.tiktoks.get(item.uid));
    if (isExisted) {
      return db.tiktoks.update(item.uid, item);
    }
    return db.tiktoks.add(item, item.uid);
  }

  async updateStatus(id: string, status: string) {
    const isExisted = !!(await db.tiktoks.get(id));
    if (isExisted) {
      return db.tiktoks.update(id, { status });
    }
  }

  async deleteAsync(uid: string) {
    const isExisted = !!(await db.tiktoks.get(uid));
    if (isExisted) {
      return db.tiktoks.delete(uid);
    }
  }
}

export const db = new DBDexie();
