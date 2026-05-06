import { fetchStockSearch } from "@/lib/yahoo-finance/fetchStockSearch"
import Link from "next/link"
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns"

// Change parameter type to Date
function timeAgo(publishDate: Date | number | undefined) {
  if (!publishDate) return "Unknown time"
  
  const date = new Date(publishDate)
  const now = new Date()

  const diffInMinutes = differenceInMinutes(now, date)
  const diffInHours = differenceInHours(now, date)
  const diffInDays = differenceInDays(now, date)

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago` // Shortened for cleaner UI
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    return `${diffInDays}d ago`
  }
}

export default async function News({ ticker }: { ticker: string }) {
  const newsData = await fetchStockSearch(ticker)
  const url = `https://uk.finance.yahoo.com/quote/${ticker}`

  // Safety check for newsData
  if (!newsData?.news || newsData.news.length === 0) {
    return (
      <div className="py-4 text-center text-sm font-medium text-muted-foreground">
        No Recent Stories
      </div>
    )
  }

  return (
    <div className="w-full lg:w-4/5">
      <Link
        href={url}
        target="_blank" // Better UX for external links
        rel="noopener noreferrer"
        className="group flex w-fit flex-row items-center gap-2 pb-4 text-sm font-medium text-blue-500"
      >
        See More Data from Yahoo Finance
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Link>

      <div className="flex flex-col gap-6">
        {newsData.news.map((article) => (
          <Link
            key={article.uuid}
            href={article.link}
            target="_blank"
            className="flex flex-col gap-1 hover:opacity-80 transition-opacity"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {article.publisher} • {timeAgo(article.providerPublishTime)}
            </span>
            <span className="font-bold leading-snug">{article.title}</span>
            {/* Removed article.published_at as it's redundant/non-existent */}
          </Link>
        ))}
      </div>
    </div>
  )
}