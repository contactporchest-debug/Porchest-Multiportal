"use client"

import useSWR from "swr"
import { useState } from "react"
import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Influencer = { id: string; name: string; niche: string; platform: string; followers: number; estRoi: number }

export function ChatbotRecommendations() {
  const [query, setQuery] = useState("")
  const { data, isLoading, error } = useSWR<Influencer[]>("/api/dummy/influencers", fetcher)

  const filtered = (data || []).filter((inf) => {
    const q = query.toLowerCase()
    return (
      inf.name.toLowerCase().includes(q) ||
      inf.niche.toLowerCase().includes(q) ||
      inf.platform.toLowerCase().includes(q)
    )
  })

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Chatbot Influencer Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Describe your campaign or type a niche (e.g., tech in Pakistan)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="button" onClick={() => setQuery("")}>
            Clear
          </Button>
        </div>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : null}
        {error ? <p className="text-destructive">Failed to load</p> : null}
        <div className="grid md:grid-cols-3 gap-3">
          {filtered.map((i) => (
            <div key={i.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">{i.name}</h4>
                <span className="text-xs text-muted-foreground">{i.platform}</span>
              </div>
              <p className="text-sm text-muted-foreground">{i.niche}</p>
              <div className="mt-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Followers:</span> {i.followers.toLocaleString()}
                </div>
                <div>
                  <span className="text-muted-foreground">Est. ROI:</span> {i.estRoi}x
                </div>
              </div>
              <div className="mt-3">
                <Button variant="secondary" size="sm">
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
