"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = __importStar(require("puppeteer"));
let browser;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    browser = yield puppeteer.launch({
        headless: false,
        defaultViewport: {
            height: 1020,
            width: 1080,
        },
    });
    const products = [];
    const links = yield gatherLinks();
    const page = yield browser.newPage();
    for (const link of links) {
        yield page.goto(link);
        const title = yield page.evaluate(() => {
            var _a;
            const titleSel = document.querySelector("#ad-title");
            const title = (_a = titleSel === null || titleSel === void 0 ? void 0 : titleSel.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, "").trim();
            return title;
        });
        const price = yield page.evaluate(() => {
            const priceSel = document.querySelector("#show-post-render-app > div > section.list-announcement.js-analytics-category.single-item._advert > div > div.list-announcement-right > div > div.announcement-content-container.card-side > div.announcement-price > div > div > meta:nth-child(2)");
            const price = priceSel === null || priceSel === void 0 ? void 0 : priceSel.content;
            return price;
        });
        const images = yield page.evaluate(() => {
            const imageSel = document.querySelectorAll("#show-post-render-app > div > section.list-announcement.js-analytics-category.single-item._advert > div > div.list-announcement-left > div.announcement-content-container > div.announcement__images > img");
            const images = [];
            for (const image of imageSel) {
                let imageSrc = image.src;
                images.push(imageSrc);
            }
            return images;
        });
        const phoneInfo = yield page.evaluate(() => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            const infoItems = document.querySelectorAll("#show-post-render-app > div > section.list-announcement.js-analytics-category.single-item._advert > div > div.list-announcement-left > div.announcement-content-container > div.announcement-characteristics.clearfix > ul > li");
            let color;
            let storage;
            let condition;
            for (let item of infoItems) {
                let row = item.children;
                if (((_b = (_a = row[0]) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.replace(/\n/g, "").trim()) === "Color:") {
                    color = (_d = (_c = row[1]) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.replace(/\n/g, "").trim();
                }
                else if (((_f = (_e = row[0]) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.replace(/\n/g, "").trim()) === "Storage:") {
                    storage = (_h = (_g = row[1]) === null || _g === void 0 ? void 0 : _g.textContent) === null || _h === void 0 ? void 0 : _h.replace(/\n/g, "").trim();
                }
                else if (((_k = (_j = row[0]) === null || _j === void 0 ? void 0 : _j.textContent) === null || _k === void 0 ? void 0 : _k.replace(/\n/g, "").trim()) === "Condition:") {
                    condition = (_m = (_l = row[1]) === null || _l === void 0 ? void 0 : _l.textContent) === null || _m === void 0 ? void 0 : _m.replace(/\n/g, "").trim();
                }
            }
            return { color, storage, condition };
        });
        const { color, storage, condition } = phoneInfo;
        products.push({ title, price, color, storage, condition, images, link });
    }
    console.log("products", products);
});
main();
const gatherLinks = () => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield browser.newPage();
    yield page.goto("https://pin.tt/phones-computers-electronics/mobile-phones/iphone/");
    const links = yield page.evaluate(() => {
        const $ = document.querySelectorAll.bind(document);
        const sel = $("#listing > section > div.wrap > div.list-announcement-left > div.list-announcement-assortiments > ul.list-simple__output.js-list-simple__output .mask");
        const mapped = Array.from(sel).map((item) => item.href);
        return mapped;
    });
    yield page.close();
    return links;
});
