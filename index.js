const fs = require('fs');
const path = require('path');

function loadJson(filePath) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

const commands = loadJson('commands.json');
const keys = loadJson('keys.json');

function readAndCorrectBash(scriptPath) {
    const script = fs.readFileSync(scriptPath, 'utf8');
    const lines = script.split('\n');
    let correctedScript = '';

    lines.forEach((line, index) => {
        let correctedLine = line;
        const words = line.trim().split(' ');
        const command = words[0];

        if (commands['base-commands']) {
            Object.keys(commands['base-commands']).forEach(key => {
                if (commands['base-commands'][key].uncorrect.includes(command)) {
                    const correctCommand = commands['base-commands'][key].correct;
                    correctedLine = line.replace(command, correctCommand);
                }
            });
        }

        correctedScript += correctedLine + '\n';
    });

    return correctedScript;
}

function writeCorrectedScript(originalPath, correctedScript) {
    const dir = path.dirname(originalPath);
    const originalName = path.basename(originalPath, '.sh');
    const newFilePath = path.join(dir, `${originalName}_diff.sh`);
    fs.writeFileSync(newFilePath, correctedScript);
    console.log(`Corrected script written to ${newFilePath}`);
}

// Hauptlogik
const scriptPath = process.argv[2]; // Nimmt den Pfad des Skripts von der Kommandozeile

if (!scriptPath) {
    console.error('Please provide a script path.');
    process.exit(1);
}

const correctedScript = readAndCorrectBash(scriptPath);
writeCorrectedScript(scriptPath, correctedScript);