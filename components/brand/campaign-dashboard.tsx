"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Campaign = { id: string; title: string; status: string; influencers: number; budget: number }

export function CampaignDashboard() {
  const { data, isLoading, error } = useSWR<Campaign[]>("/api/dummy/campaigns", fetcher)

  const hasActive = (data || []).some((c) => c.status === "Active")

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : null}
        {error ? <p className="text-destructive">Failed to load</p> : null}
        {!hasActive ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No running campaigns</p>
            <Button className="mt-4" variant="secondary">
              Create Campaign
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {data?.map((c) => (
              <div key={c.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{c.title}</h4>
                  <span className="text-xs text-muted-foreground">{c.status}</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Influencers: {c.influencers} • Budget: ${c.budget.toLocaleString()}
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="secondary">
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
