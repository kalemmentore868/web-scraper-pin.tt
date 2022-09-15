import * as puppeteer from "puppeteer";
import mongoose from "mongoose";
import Iphone from "./iphoneSchema";

let browser: puppeteer.Browser;

mongoose
  .connect(
    "mongodb+srv://kalem868:kiojah123@cluster0.ulzyh.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Mongo connection open");
  })
  .catch((err) => {
    console.log("error");
    console.log(err);
  });

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
  console.log("got links");
  const page = await browser.newPage();
  for (const link of links) {
    await page.goto(link);

    const title = await page.evaluate(() => {
      const titleSel = document.querySelector("#ad-title");
      const title = titleSel?.textContent?.replace(/\n/g, "").trim();

      return title;
    });

    const description = await page.evaluate(() => {
      const descSel = document.querySelector('[itemprop="description"]');
      const descPtags = descSel?.children;
      let description = "";
      if (descPtags) {
        for (let desc of descPtags) {
          const descText = desc.textContent?.replace(/\n/g, "").trim();
          description += descText + ". ";
        }
      }

      return description;
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
    products.push({
      title,
      price,
      description,
      color,
      storage,
      condition,
      images,
      link,
    });
  }
  console.log("got products time to insert to mongo");
  Iphone.insertMany(products)
    .then(function () {
      console.log("Data inserted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
};

main();

const gatherLinks = async () => {
  const page = await browser.newPage();
  await page.goto(
    "https://pin.tt/phones-computers-electronics/mobile-phones/iphone/"
  );
  let paginatedLinks = [];
  for (let i = 0; i < 2; i++) {
    const links = await page.evaluate(() => {
      const $ = document.querySelectorAll.bind(document);

      const sel: NodeListOf<HTMLAnchorElement> = $(
        "#listing > section > div.wrap > div.list-announcement-left > div.list-announcement-assortiments > ul.list-simple__output.js-list-simple__output .mask"
      );

      const mapped = Array.from(sel).map(
        (item: HTMLAnchorElement) => item.href
      );

      return mapped;
    });

    paginatedLinks.push(...links);
    const pageNumber = i + 2;

    //pagination
    try {
      await page.evaluate(async () => {
        const el: HTMLAnchorElement | null = document.querySelector(
          "a.number-list-next.js-page-filter.number-list-line"
        );
        el?.click();

        await page.waitForResponse((response) => {
          return response.url().includes(`?page=${pageNumber}`);
        });

        await page.waitForNavigation();

        await page.waitForSelector("section.list-announcement", {
          timeout: 0,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
  await page.close();
  return paginatedLinks;
};
