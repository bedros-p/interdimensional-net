import * as fs from 'fs';
import * as path from 'path';

const wordsPath = path.join(__dirname, '../constants.txt');
const words = fs.readFileSync(wordsPath, 'utf-8').split('\n');

const siteTypes = [
    "forum", "recipe", "chatroom", "blog", "socialmedia", "newsaggregator", "ecommerce", "portfolio", "wiki", "qanda", "reviews", "videosharing", "photosharing", "musicstreaming", "podcastdirectory", "educational", "jobboard", "realestate", "travelbooking", "searchengine", "classifieds", "auction", "pricecomparison", "coupons", "crowdfunding", "urlshortener", "filehosting", "codeeditor", "projectmanagement", "crm", "surveytool", "websitebuilder", "domainregistrar", "webhosting", "onlinedating", "fantasysports", "memegenerator", "stockphotos", "fontlibrary", "designtool", "mindmapping", "presentations", "documenteditor", "calendar", "todolist", "notetaking", "weather", "maps", "translation", "encyclopedia"
];

// Simple hashing function (djb2)
function hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash;
}

// Pseudo-random number generator (LCG)
function createPrng(seed: number) {
    return function() {
        seed = (seed * 1664525 + 1013904223) | 0; // Bitwise OR to keep it a 32-bit integer
        return seed;
    }
}

export function generateConceptFromSeed(seedStr: string): string {
    const seed = hashString(seedStr);
    const prng = createPrng(seed);

    const word1Index = Math.abs(prng()) % words.length;
    const word2Index = Math.abs(prng()) % words.length;
    const siteTypeIndex = Math.abs(prng()) % siteTypes.length;

    const word1 = words[word1Index];
    const word2 = words[word2Index];
    const siteType = siteTypes[siteTypeIndex];

    return `${word1} ${word2} ${siteType}`;
}
