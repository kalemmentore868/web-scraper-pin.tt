import * as puppeteer from "puppeteer";

let browser: puppeteer.Browser;

const main = async () => {
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      height: 1020,
      width: 1080,
    },
  });

  const titles = [];

  const links = await gatherLinks();
  const page = await browser.newPage();
  for (const link of links) {
    await page.goto(link);

    const title = await page.evaluate(() => {
      const titleSel = document.querySelector("#ad-title");
      return titleSel?.textContent;
    });
    titles.push(title);
  }
  console.log("titles", titles);
};

main();

const gatherLinks = async () => {
  const page = await browser.newPage();
  await page.goto(
    "https://pin.tt/phones-computers-electronics/mobile-phones/iphone/"
  );
  const links = await page.evaluate(() => {
    const $ = document.querySelectorAll.bind(document);

    const sel: NodeListOf<HTMLAnchorElement> = $(
      "#listing > section > div.wrap > div.list-announcement-left > div.list-announcement-assortiments > ul.list-simple__output.js-list-simple__output .mask"
    );

    const mapped = Array.from(sel).map((item: HTMLAnchorElement) => item.href);

    return mapped;
  });
  await page.close();
  return links;
};
