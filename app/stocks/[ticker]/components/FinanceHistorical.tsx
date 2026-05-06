import { fetchHistorical } from "@/lib/yahoo-finance/fetchHistorical"

function formatNumber(num: number) {
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  return num?.toLocaleString() ?? "0"
}

export type TimeFilter = "1d" | "1w" | "1m" | "3m" | "1y" | "5y";

export default async function FinanceHistorical({ ticker, range }: { ticker: string; range: TimeFilter }) {
  // Asumsi: fetchHistorical mengembalikan array of objects
  const history = await fetchHistorical(ticker, range)

  if (!history || !Array.isArray(history)) {
    return <div className="text-muted-foreground text-sm">No historical data available.</div>
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium text-right">Open</th>
            <th className="px-4 py-3 font-medium text-right">High</th>
            <th className="px-4 py-3 font-medium text-right">Low</th>
            <th className="px-4 py-3 font-medium text-right">Close</th>
            <th className="px-4 py-3 font-medium text-right">Volume</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {history.map((day: any, index: number) => (
            <tr key={index} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap">
                {new Date(day.date).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
              <td className="px-4 py-3 text-right font-mono">{day.open?.toFixed(2)}</td>
              <td className="px-4 py-3 text-right font-mono text-green-600">{day.high?.toFixed(2)}</td>
              <td className="px-4 py-3 text-right font-mono text-red-600">{day.low?.toFixed(2)}</td>
              <td className="px-4 py-3 text-right font-mono font-bold">{day.close?.toFixed(2)}</td>
              <td className="px-4 py-3 text-right font-mono">{formatNumber(day.volume)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}