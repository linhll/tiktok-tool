import { db } from "../db";

export async function importDataFromFileAsync(
  file: File
): Promise<TiktokAccount[]> {
  return file
    .text()
    .then((text) => {
      const lines = text.split(/\r\n?/);
      return lines.map((line) => {
        if (!line.trim()) {
          return undefined;
        }
        const splited = line.split("|");
        if (splited[2] === "Auto") {
          const [
            email,
            email_password,
            payment,
            password,
            twoFaEnabledStr,
            currency,
            temp,
            uid,
            secret,
          ] = splited;
          return {
            email,
            email_password,
            payment,
            password,
            twoFaEnabled: !!secret,
            currency,
            uid,
            secret,
          };
        }
        const [email, email_password, password, secret, uid, currency] =
          splited;
        return {
          email,
          email_password,
          payment: "Auto",
          password,
          twoFaEnabled: !!secret,
          currency,
          uid,
          secret,
        };
      });
    })
    .then((arr) => arr.filter((item) => !!item))
    .then(async (accounts) => {
      for (const account of accounts) {
        if (account) {
          await db.addOrUpdateTiktok(account);
        }
      }
      return accounts;
    });
}
