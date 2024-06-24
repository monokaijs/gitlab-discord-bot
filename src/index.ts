import moduleAlias from "module-alias";
import dotEnv from "dotenv";
moduleAlias.addAliases({
  "@src": `${__dirname}`,
  "@src/*": `${__dirname}/*`
});
dotEnv.config();

import databaseService from "@src/services/database.service";
import webService from "@src/services/web.service";
import discordService from "@src/services/discord.service";


Promise.all([
  databaseService.register(),
  discordService.register(),
  webService.register(),
]).then(() => {
  console.log('App startup successfully.');
});
