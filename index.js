import { schedule, params } from "@ampt/sdk";
import { data } from "@ampt/data";
// import fetch from "node-fetch";
import * as cheerio from "cheerio";

schedule("Bereal History").every("1 minute", async () => {
  console.log("I run every minute!");
  console.log(params("AIRTABLE_API_KEY"));
  const url = "https://stealthoptional.com/apps/what-time-is-bereal/";
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const table = $(".table-wrapper__table");
  const tableJson = table
    .map((i, el) => {
      const $el = $(el);
      const $rows = $el.find("tr");
      const $headers = $rows.eq(0).find("th");
      const $cells = $rows.slice(1).find("td");
      const headers = $headers.map((i, el) => $(el).text()).get();
      const cells = $cells.map((i, el) => $(el).text()).get();
      const rows = cells.reduce((acc, cell, i) => {
        const row = Math.floor(i / headers.length);
        const col = i % headers.length;
        acc[row] = acc[row] || [];
        acc[row][col] = cell;
        return acc;
      }, []);
      return rows;
    })
    .get();

  console.log(tableJson);

  await data.set("foo", "bar2", {
    overwrite: true,
  });

  await data.set("Bereal History", tableJson, {
    overwrite: true,
  });

  // const createNewRecord = (row) => {
  //   const time = row[0];
  //   const [day, month, year] = time.split("-");
  //   const date = new Date(`${year}-${month}-${day}`);
  //   const id = date.getTime();
  //   const fields = {
  //     fields: {
  //       id,
  //       date,
  //       americas_ct: row[1],
  //       east_asia_ist: row[2],
  //     },
  //   };
  //   return data("Bereal History").create(fields);
  // };

  // const createNewRecords = () => {
  //   Promise.all(tableJson.map((row) => createNewRecord(row)));
  // };

  // deleteAllRecords();
  // createNewRecords();

  console.log("I rasfasfa");
});
