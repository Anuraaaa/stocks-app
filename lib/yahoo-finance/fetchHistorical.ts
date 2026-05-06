import { unstable_noStore as noStore } from "next/cache";
import YahooFinance from "yahoo-finance2";

// Definisikan type untuk filter agar type-safe
export type TimeFilter = "1d" | "1w" | "1m" | "3m" | "1y" | "5y" | "10y";

export async function fetchHistorical(ticker: string, range: TimeFilter = "1d") {
  noStore();
  const yahooFinance = new YahooFinance()

  const today = new Date();
  const startDate = new Date();

  switch (range) {
    case "1d":
      startDate.setDate(today.getDate() - 1);
      break;
    case "1w":
      startDate.setDate(today.getDate() - 7);
      break;
    case "1m":
      startDate.setMonth(today.getMonth() - 1);
      break;
    case "3m":
      startDate.setMonth(today.getMonth() - 3);
      break;
    case "1y":
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    case "5y":
      startDate.setFullYear(today.getFullYear() - 5);
      break;
  }

  let interval: "1d" | "1wk" | "1mo" = "1d";
  if (range === "5y") interval = "1mo"; 
  else if (range === "1y") interval = "1wk";

  try {
    const queryOptions = {
      period1: startDate,
      period2: today,
      interval: interval,
    };

    const response = await yahooFinance.historical(ticker, queryOptions);
    return response;
  } catch (error) {
    console.error(`Failed to fetch ${range} data for ${ticker}:`, error);
    // throw new Error("Failed to fetch historical data.");
  }
}