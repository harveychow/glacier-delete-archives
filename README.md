# Delete all archives in a AWS Glacier Vault
Amazon doesn't provide an easy way to delete Glacier vaults. When a vault still contains archives, you'll have to delete them before deleting archives. This is quite a troublesome process.

First you need fetch a list of all archives. Which can take several hours. Then you need to extract the `ArchiveId` from each archive and manually delete the archive via a `aws-cli` command.

This script helps you with this last step.

## Requirements
1. aws-cli - https://aws.amazon.com/cli/
2. nodejs - https://nodejs.org/

## Usage
1. Create an *Inventory Retrieval* job via aws-cli. (This can take several hours)
2. After it's done output the Archive list to a file named `output.json`.
3. Run this script to delete all archives in this JSON file.
```bash
$ npm install
$ node glacier-delete.js {vault name} --json-file {JSON output file}
```

## Parameters
| Variable   | Required | Default value | Notes                                      |
|------------|----------|---------------|--------------------------------------------|
| vault-name | true     |               |                                            |
| account-id |          | -             | - = default account id for current profile |
| wait-time  |          | 500           | in milliseconds                            |
| json-file  |          | ./output.json |                                            |

## Resources
More information here: https://docs.aws.amazon.com/amazonglacier/latest/dev/deleting-an-archive-using-cli.html