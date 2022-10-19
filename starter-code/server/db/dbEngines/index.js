module.exports = async (engine) => {
    try {
        const engineInstance = await require(`./${engine}`);
        if (!engineInstance) throw new Error('Invalid DB Engine');
        return engineInstance;
    } catch (error) {
        throw new Error(error);
    }
}