const router = require("express").Router();
const puppeteer = require("puppeteer");
const ITEM_URL = "https://www.xe.com/currencyconverter/";

router.get("/", async (req, res, next) => {
  res.send({ message: "Ok api is working 🚀" });
});

router.get("/currency-exchange", async (req, res) => {
  try {
    const { from, to } = req.query;
    const browser = await puppeteer.launch({ headless : true});
    const page = await browser.newPage();
    await page.goto(ITEM_URL);
    await page.$eval(
      "#midmarketFromCurrency-current-selection",
      (el, from) => (el.value = from),
      from
    );

    await page.$eval(
      "#midmarketToCurrency-current-selection",
      (el, to) => (el.value = to),
      to
    );

    await page.click(
      "#__next > div:nth-child(2) > div.fluid-container__BaseFluidContainer-qoidzu-0.gJBOzk > section > div:nth-child(2) > div > main > div > div.currency-converter__SubmitZone-zieln1-3.eIzYlj > button"
    );
    const element = await page.waitForSelector(
      "#__next > div:nth-child(2) > div.fluid-container__BaseFluidContainer-qoidzu-0.gJBOzk > section > div:nth-child(2) > div > main > div > div:nth-child(2) > div:nth-child(1) > p.result__BigRate-sc-1bsijpp-1.iGrAod"
    ); // select the element
    const value = await element.evaluate((el) => el.innerText);

    await browser.close();
    const rees = parseFloat(value) * 100;

    res.send({
      exchange_rate: rees.toFixed(2),
      source: ITEM_URL,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/convert", async (req, res) => {
  try {
    const from = req.query.from;
    const to = req.query.to;
    const amount = req.query.amount;

    const browser = await puppeteer.launch({ headless : true});
    const page = await browser.newPage();
    await page.goto(`${ITEM_URL}convert/?Amount=${amount}&From=${from}&To=${to}`);
    const element = await page.waitForSelector(
      "#__next > div:nth-child(2) > div:nth-child(6) > section > div > table > tbody > tr:nth-child(1) > td:nth-child(2)"
    );
    const element2 = await page.waitForSelector(
      "#__next > div:nth-child(2) > div:nth-child(6) > section > div > table > tbody > tr:nth-child(2) > td:nth-child(2)"
    );
    const value = await element.evaluate((el) => el.innerText);
    const value2 = await element2.evaluate((el) => el.innerText);

    await browser.close();

    res.json({
      max_value: (value * 100000).toFixed(1),
      min_value: (value2 * 100000).toFixed(1),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
