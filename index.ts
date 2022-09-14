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

  const products = [];

  const links = await gatherLinks();
  const page = await browser.newPage();
  for (const link of links) {
    await page.goto(link);

    const title = await page.evaluate(() => {
      const titleSel = document.querySelector("#ad-title");
      const title = titleSel?.textContent?.replace(/\n/g, "").trim();

      return title;
    });

    const price = await page.evaluate(() => {
      const priceSel = document.querySelector(
        "#show-post-render-app > div > section.list-announcement.js-analytics-category.single-item._advert > div > div.list-announcement-right > div > div.announcement-content-container.card-side > div.announcement-price > div > div > meta:nth-child(2)"
      ) as HTMLMetaElement;
      const price = priceSel?.content;

      return price;
    });

    const images = await page.evaluate(() => {
      const imageSel: NodeListOf<HTMLImageElement> = document.querySelectorAll(
        "#show-post-render-app > div > section.list-announcement.js-analytics-category.single-item._advert > div > div.list-announcement-left > div.announcement-content-container > div.announcement__images > img"
      );
      const images = [];
      for (const image of imageSel) {
        let imageSrc = image.src;
        images.push(imageSrc);
      }

      return images;
    });

    const phoneInfo = await page.evaluate(() => {
      const infoItems = document.querySelectorAll(
        "#show-post-render-app > div > section.list-announcement.js-analytics-category.single-item._advert > div > div.list-announcement-left > div.announcement-content-container > div.announcement-characteristics.clearfix > ul > li"
      );

      let color: string | null | undefined;
      let storage: string | null | undefined;
      let condition: string | null | undefined;

      for (let item of infoItems) {
        let row = item.children;
        if (row[0]?.textContent?.replace(/\n/g, "").trim() === "Color:") {
          color = row[1]?.textContent?.replace(/\n/g, "").trim();
        } else if (
          row[0]?.textContent?.replace(/\n/g, "").trim() === "Storage:"
        ) {
          storage = row[1]?.textContent?.replace(/\n/g, "").trim();
        } else if (
          row[0]?.textContent?.replace(/\n/g, "").trim() === "Condition:"
        ) {
          condition = row[1]?.textContent?.replace(/\n/g, "").trim();
        }
      }
      return { color, storage, condition };
    });

    const { color, storage, condition } = phoneInfo;
    products.push({ title, price, color, storage, condition, images, link });
  }
  console.log("products", products);
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
