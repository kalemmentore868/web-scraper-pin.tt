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
    const titles = [];
    const links = yield gatherLinks();
    const page = yield browser.newPage();
    for (const link of links) {
        yield page.goto(link);
        const title = yield page.evaluate(() => {
            const titleSel = document.querySelector("#ad-title");
            return titleSel === null || titleSel === void 0 ? void 0 : titleSel.textContent;
        });
        titles.push(title);
    }
    console.log("titles", titles);
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
