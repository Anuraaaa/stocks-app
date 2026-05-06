import StockChart from "@/components/chart/StockChart"
import CompanySummaryCard from "@/app/stocks/[ticker]/components/CompanySummaryCard"
import FinanceHistorical from "@/app/stocks/[ticker]/components/FinanceHistorical"
import News from "@/app/stocks/[ticker]/components/News"
import { Card, CardContent } from "@/components/ui/card"
import { DEFAULT_INTERVAL, DEFAULT_RANGE } from "@/lib/yahoo-finance/constants"
import {
  validateInterval,
  validateRange,
} from "@/lib/yahoo-finance/fetchChartData"
import { Interval } from "@/types/yahoo-finance"
import { Suspense } from "react"
import type { Metadata } from "next"
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote"

type Props = {
  params: Promise<{
    ticker: string
  }>
  searchParams?: Promise<{
    ticker?: string
    range?: string
    interval?: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params // Await params

  try {
    const quoteData = await fetchQuote(ticker)
    const price = quoteData?.regularMarketPrice
    
    const regularMarketPrice = price 
      ? price.toLocaleString("en-US", { style: "currency", currency: "USD" })
      : ""

    return {
      title: `${ticker} ${regularMarketPrice}`.trim(),
      description: `Stock data and financial charts for ${ticker}`,
      keywords: [ticker, "stocks", "finance"],
    }
  } catch (error) {
    return { title: ticker }
  }
}

export default async function StocksPage({ params, searchParams }: Props) {
  const { ticker } = await params
  const range = validateRange((await searchParams)?.range || DEFAULT_RANGE)
  const interval = validateInterval(
    range,
    (await searchParams)?.interval as Interval || DEFAULT_INTERVAL
  )

  return (
    <div>
      <Card>
        <CardContent className="space-y-10 pt-6 lg:px-40 lg:py-14">
          <Suspense
            fallback={
              <div className="flex h-[27.5rem] items-center justify-center text-muted-foreground ">
                Loading...
              </div>
            }
          >
            <StockChart ticker={ticker} range={range} interval={interval} />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex h-[10rem] items-center justify-center text-muted-foreground ">
                Loading...
              </div>
            }
          >
            <FinanceHistorical ticker={ticker} range={range} />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex h-[10rem] items-center justify-center text-muted-foreground ">
                Loading...
              </div>
            }
          >
            <CompanySummaryCard ticker={ticker} />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex h-[20rem] items-center justify-center text-muted-foreground ">
                Loading...
              </div>
            }
          >
            <News ticker={ticker} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
