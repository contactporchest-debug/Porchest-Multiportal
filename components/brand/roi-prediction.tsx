"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export function RoiPrediction() {
  const [range, setRange] = useState<"2w" | "1m">("2w")

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">ROI Prediction</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex items-center gap-3">
          <Select value={range} onValueChange={(v: "2w" | "1m") => setRange(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Forecast Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2w">Next 2 weeks</SelectItem>
              <SelectItem value="1m">Next 1 month</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="secondary"
            onClick={() => {
              /* placeholder */
            }}
          >
            Forecast
          </Button>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground">
            Predicted ROI for {range === "2w" ? "the next two weeks" : "the next month"} will appear here.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
