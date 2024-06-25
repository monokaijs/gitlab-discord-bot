import moduleAlias from "module-alias";
import dotEnv from "dotenv";
moduleAlias.addAliases({
  "@": `${__dirname}`,
  "@/*": `${__dirname}/*`
});
dotEnv.config();

import databaseService from "@/services/database.service";
import webService from "@/services/web.service";
import discordService from "@/services/discord.service";


Promise.all([
  databaseService.register(),
  discordService.register(),
  webService.register(),
]).then(() => {
  console.log('App startup successfully.');
});
