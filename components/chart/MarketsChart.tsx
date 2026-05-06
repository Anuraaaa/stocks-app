import { fetchChartData } from "@/lib/yahoo-finance/fetchChartData"
import { Interval, Range } from "@/types/yahoo-finance"
import AreaClosedChart from "./AreaClosedChart"
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote"

export default async function MarketsChart({
  ticker,
  range,
  interval,
}: {
  ticker: string
  range: Range
  interval: Interval
}) {
interface ChartResponse {
  quotes: any[]; // Replace 'any' with your specific quote type if known
  symbol?: string;
}

// Cast the result when you fetch it
  const chartDataPromise = (await fetchChartData(ticker, range, interval)) as ChartResponse;
  const quoteDataPromise = fetchQuote(ticker)

  // 2. Await them together
  const [chart, quote] = await Promise.all([chartDataPromise, quoteDataPromise])

  // 3. Process data safely
  // Note: We use Number() because charts need numeric values, not strings from .toFixed()
  const stockQuotes = chart?.quotes
    ? chart.quotes
        .filter((q) => q.close !== null && q.close !== undefined && q.date !== null)
        .map((q) => ({
          date: new Date(q.date), // Ensure it's a Date object
          close: Number(q.close),  // Keep as a number for the chart scales
        }))
    : []

  return (
    <>
      <div className="mb-0.5 font-medium">
        {quote?.shortName} ({quote?.symbol}){" "}
        {quote?.regularMarketPrice?.toLocaleString(undefined, {
          style: "currency",
          currency: quote?.currency || "USD",
        })}
      </div>
      
      {stockQuotes.length > 0 ? (
        <AreaClosedChart chartQuotes={stockQuotes} range={range} />
      ) : (
        <div className="flex h-full items-center justify-center text-center text-neutral-500">
          No data available for this period
        </div>
      )}
    </>
  )
}