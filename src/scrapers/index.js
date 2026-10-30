import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import config from '../../config.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Dynamically loads and instantiates the active scrapers configured in config.json
 */
export async function getActiveScrapers(globalConfig = {}) {
    const activeScrapers = [];

    for (const activeId of config.activeScrapers) {
        const scraperConfig = config.scrapers.find(s => s.id === activeId);

        if (!scraperConfig) {
            console.error(`Error: The '${activeId}' scraper is set active, but not configured!`);
            continue;
        }

        try {
            const classFilePath = path.join(__dirname, `${scraperConfig.class}.js`);
            
            const classFileUrl = pathToFileURL(classFilePath).href;

            const module = await import(classFileUrl);
            
            const ScraperClass = module.default || module[scraperConfig.class];

            const instance = new ScraperClass({
                ...scraperConfig,
                ...(globalConfig[activeId] || {})
            });

            activeScrapers.push(instance);
        } catch (error) {
            console.error(`Error in ${scraperConfig.class} class:`, error.message);
        }
    }

    return activeScrapers;
}
