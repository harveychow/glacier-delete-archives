#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

require("yargs")
  .usage("$0 <vault-name> [args]")
  .command(
    "$0 <vault-name>",
    "Delete all archives from JSON output",
    (yargs) => {
      yargs
        .positional("vault-name", {
          type: "string",
          describe: "Name of your vault",
        })
        .option("account-id", {
          type: "string",
          default: "-",
          describe: "Your AWS account-id. Leave empty for default account.",
        })
        .option("json-file", {
          type: "string",
          default: "./output.json",
          describe: "Path to Inventory List output JSON file.",
        })
        .option("wait-time", {
          type: "number",
          default: 500,
          describe: "Milliseconds wait after each delete command.",
        })
        .option("verbose", {
          alias: "v",
          type: "boolean",
          default: false,
          describe: "Show debug info.",
        });
    },
    (argv) => {
      deleteGlacierArchives(argv);
    }
  )
  .help().argv;

function deleteGlacierArchives(argv) {
  const fs = require("fs");

  if (!fs.existsSync(path.resolve(argv.jsonFile))) {
    console.error(`Can't find JSON output file: ${argv.jsonFile}`);
    return;
  }

  const rawData = fs.readFileSync(path.resolve(argv.jsonFile));
  const data = JSON.parse(rawData);

  data.ArchiveList.forEach((value) => {
    setTimeout(() => {
      const cmd = `aws glacier delete-archive --account-id ${argv.accountId} --vault-name ${argv.vaultName} --archive-id=${value.ArchiveId}`;
      if (argv.verbose) console.log(`COMMAND: ${cmd}`);

      execSync(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }, argv.waitTime);
  });
}
