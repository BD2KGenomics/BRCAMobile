const { exec, execSync } = require('child_process');
const { existsSync, mkdirSync } = require('fs');

const SCREENSHOT_DIR = '/tmp/screenshots';

const SCREENSHOT_OPTIONS = {
    timeout: 1000,
    killSignal: 'SIGKILL',
    shell: "/bin/bash"
};

let screenshotIndex = 0;

const takeScreenshot = (targetName) => {
    if (!existsSync(SCREENSHOT_DIR))
        mkdirSync(SCREENSHOT_DIR);

    const resultName = targetName ? targetName : `screenshot-${screenshotIndex++}`;

    try {
        execSync(`/usr/bin/xcrun simctl io booted screenshot ${SCREENSHOT_DIR}/${resultName}.png`, SCREENSHOT_OPTIONS)
    }
    catch (e) {
        console.log("Screenshot failed: ", e);
        throw e;
    }
};

module.exports = { takeScreenshot };
