const { takeScreenshot } = require ('./takeScreenshot');

const menuItems = [
    "nav-home",
    "nav-search",
    "nav-following",
    "nav-notify-log",
    "nav-about",
    "nav-user-guide",
];

async function dismissDisclaimer() {
    try {
        await expect(element(by.id('disclaimer-agree'))).toBeVisible();
        await element(by.id('disclaimer-agree')).tap();
        await expect(element(by.id('disclaimer-agree'))).toBeNotVisible();
    }
    catch (e) {
        console.warn("didn't find disclaimer, but continuing anyway");
    }
}

async function goToScreen(target) {
    await expect(element(by.id('hamburger-menu'))).toBeVisible();
    await element(by.id('hamburger-menu')).tap();
    await expect(element(by.text('BRCA Exchange'))).toBeVisible();

    // tap the navbar element
    await element(by.id(target).withAncestor(by.id('navbar-holder'))).tap();
}

describe('Launch Tests', () => {
    beforeAll(async () => {
        await device.launchApp({
            // delete: true,
            permissions: { notifications: 'YES' }
        });

        await dismissDisclaimer();
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('should show menu button, then show menu contents on press', async () => {
        await expect(element(by.id('hamburger-menu'))).toBeVisible();
        await element(by.id('hamburger-menu')).tap();
        await expect(element(by.text('BRCA Exchange'))).toBeVisible();
    });

    it('should take screenshots of all the screens', async () => {
        await Promise.all(
            menuItems.map(async (item, idx) => {
                await goToScreen(item);
                await device._takeSnapshot(idx);
                // takeScreenshot(item);
            })
        );
    });
});
