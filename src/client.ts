

class AdModeratorClient {
    constructor(private readonly apiKey: string) {
    }

    public async moderateAd(ad: Ad): Promise<ModerationResult> {
        const response = await fetch(`${this.apiUrl}/moderate`, {
            method: 'POST',
            body: JSON.stringify(ad)
        });
    }
}