import { db } from "../db";

export async function importDataFromFileAsync(
  file: File
): Promise<TiktokAccount[]> {
  return file
    .text()
    .then((text) => {
      const lines = text.split(/\r\n?/);
      return lines.map((line) => {
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
        ] = line.split("|");
        return {
          email,
          email_password,
          payment,
          password,
          twoFaEnabled: twoFaEnabledStr === "Đã Bật 2FA",
          currency,
          uid,
          secret,
        };
      });
    })
    .then(async (accounts) => {
      for (const account of accounts) {
        await db.addOrUpdateTiktok(account);
      }
      return accounts;
    });
}
