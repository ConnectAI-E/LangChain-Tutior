import {program} from 'commander';
import figlet from 'figlet';
import * as fs from 'fs';
import inquirer from 'inquirer';
import * as dotenv from 'dotenv';
import * as log from './console-logger';

dotenv.config({path: '.env'});

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

program
    .version(packageJson.version)
    .option('-say, --say <string>', 'Say something')
    .parse(process.argv);

const opts = program.opts();

async function main() {
    console.log(figlet.textSync(process.env.APP_TITLE ?? 'My App'));
    let say = opts.say;
    if (say === undefined) {
        log.warn('No `say` option provided');
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'say',
                message: 'Say:',
            },
        ]);
        say = answers.say;
    }
    log.info(`👋 ${say}`);
}

main().catch(console.error);
