describe('Launch Tests', () => {
    beforeAll(async () => {
        await device.launchApp({
            delete: true,
            permissions: { notifications: 'YES' }
        });
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('should show disclaimer on first launch', async () => {
        await expect(element(by.id('disclaimer-agree'))).toBeVisible();
    });

    it('should hide disclaimer after dismissal', async () => {
        await expect(element(by.id('disclaimer-agree'))).toBeVisible();
        await element(by.id('disclaimer-agree')).tap();
        await expect(element(by.id('disclaimer-agree'))).toBeNotVisible();
    });
});
