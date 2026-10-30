class BaseScraper {
    get id() {
        throw new Error("The implementation of id() is required!");
    }

    async pairWithTMDB() {
        throw new Error("The implementation of pairWithTMDB() is required.");
    }
}

export default BaseScraper;