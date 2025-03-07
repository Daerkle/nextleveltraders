"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Tag } from "lucide-react"

const newsData = [
  {
    id: 1,
    title: "Fed Zinsentscheidung: Märkte reagieren positiv",
    description: "Die Federal Reserve hat ihre Zinspolitik vorgestellt. Hier sind die wichtigsten Auswirkungen auf die Märkte.",
    category: "Makroökonomie",
    date: "7. März 2024",
    readTime: "5 min",
    link: "/dashboard/news/fed-decision"
  },
  {
    id: 2,
    title: "Neue Technologietrends im Trading",
    description: "KI und Machine Learning revolutionieren den Handelsprozess. Ein Überblick über die neuesten Entwicklungen.",
    category: "Technologie",
    date: "6. März 2024",
    readTime: "7 min",
    link: "/dashboard/news/tech-trends"
  },
  {
    id: 3,
    title: "Marktanalyse: Europäische Märkte im Fokus",
    description: "Die europäischen Börsen zeigen interessante Entwicklungen. Was Trader jetzt beachten müssen.",
    category: "Marktanalyse",
    date: "5. März 2024",
    readTime: "6 min",
    link: "/dashboard/news/europe-markets"
  },
  {
    id: 4,
    title: "ESG-Trading: Nachhaltiges Investieren im Trend",
    description: "Wie nachhaltige Investments das Trading verändern und welche Chancen sich daraus ergeben.",
    category: "Trends",
    date: "4. März 2024",
    readTime: "8 min",
    link: "/dashboard/news/esg-trading"
  }
]

export default function NewsPage() {
  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">News & Analysen</h1>
        <p className="text-muted-foreground text-lg">
          Die wichtigsten Trading-News und Marktanalysen auf einen Blick
        </p>
      </div>

      {/* Featured Article */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-0">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4" />
            <span className="text-sm font-medium">Featured</span>
          </div>
          <CardTitle className="text-2xl">Trading-Ausblick 2024</CardTitle>
          <CardDescription className="text-base">
            Eine umfassende Analyse der Marktchancen und Herausforderungen für das Jahr 2024.
            Was erwartet uns in den kommenden Monaten?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link 
            href="/dashboard/news/outlook-2024"
            className={buttonVariants({ variant: "secondary" })}
          >
            Mehr lesen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      {/* News Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {newsData.map((news) => (
          <Link key={news.id} href={news.link} className="group">
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {news.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {news.readTime} Lesezeit
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary">
                  {news.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {news.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{news.date}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}