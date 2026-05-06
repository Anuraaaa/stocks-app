import { unstable_noStore as noStore } from "next/cache"
import type {
  ScreenerOptions,
  PredefinedScreenerModules,
  ScreenerResult,
} from "@/node_modules/yahoo-finance2/esm/src/modules/screener"
import YahooFinance from "yahoo-finance2"

const ITEMS_PER_PAGE = 40

export async function fetchScreenerStocks(query: string, count?: number) {
  noStore()

  const yahooFinance = new YahooFinance()

  const queryOptions: ScreenerOptions = {
    scrIds: query as PredefinedScreenerModules,
    count: count ? count : ITEMS_PER_PAGE,
    region: "US",
    lang: "en-US",
  }

  try {
    const response: ScreenerResult = await yahooFinance.screener(queryOptions)

    return response
  } catch (error) {
    console.log("Failed to fetch screener stocks", error)
    // throw new Error("Failed to fetch screener stocks.")
  }
}
