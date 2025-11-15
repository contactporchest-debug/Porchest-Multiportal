"use client"

import { PortalLayout } from "@/components/portal-layout"
import { BrandSidebar } from "@/components/brand-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calculator, TrendingUp, DollarSign, Target, Eye } from "lucide-react"

const roiData = [
  { month: "Jan", predicted: 15000, actual: 14200 },
  { month: "Feb", predicted: 18000, actual: 17800 },
  { month: "Mar", predicted: 22000, actual: 21500 },
  { month: "Apr", predicted: 25000, actual: 26200 },
  { month: "May", predicted: 28000, actual: 27800 },
  { month: "Jun", predicted: 32000, actual: 31200 },
]

const channelData = [
  { name: "Instagram", value: 45, color: "#E1306C" },
  { name: "TikTok", value: 30, color: "#000000" },
  { name: "YouTube", value: 20, color: "#FF0000" },
  { name: "Twitter", value: 5, color: "#1DA1F2" },
]

export default function ROIPredictions() {
  const [budget, setBudget] = useState([10000])
  const [duration, setDuration] = useState([30])
  const [influencerTier, setInfluencerTier] = useState("micro")
  const [niche, setNiche] = useState("fashion")

  const calculateROI = () => {
    const baseBudget = budget[0]
    const campaignDuration = duration[0]

    // Simple ROI calculation based on inputs
    let multiplier = 1.5
    if (influencerTier === "macro") multiplier = 2.2
    if (influencerTier === "mega") multiplier = 3.0

    const nicheMultiplier = niche === "tech" ? 1.3 : niche === "fashion" ? 1.1 : 1.0

    const predictedReturn = baseBudget * multiplier * nicheMultiplier * (campaignDuration / 30)
    const predictedROI = ((predictedReturn - baseBudget) / baseBudget) * 100

    return {
      investment: baseBudget,
      predictedReturn: Math.round(predictedReturn),
      predictedROI: Math.round(predictedROI),
      estimatedReach: Math.round(baseBudget * 50),
      estimatedEngagement: Math.round(baseBudget * 2.5),
    }
  }

  const predictions = calculateROI()

  return (
    <PortalLayout
      sidebar={<BrandSidebar />}
      title="ROI Predictions"
      userRole="Brand Manager"
      breadcrumbs={[{ label: "Dashboard", href: "/brand" }, { label: "ROI Predictions" }]}
    >
      <div className="space-y-6">
        {/* ROI Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Campaign ROI Calculator
            </CardTitle>
            <CardDescription>Predict your campaign performance and return on investment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Campaign Budget: ${budget[0].toLocaleString()}</Label>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    max={100000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Campaign Duration: {duration[0]} days</Label>
                  <Slider value={duration} onValueChange={setDuration} max={90} min={7} step={1} className="w-full" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tier">Influencer Tier</Label>
                  <Select value={influencerTier} onValueChange={setInfluencerTier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">Micro (1K-100K followers)</SelectItem>
                      <SelectItem value="macro">Macro (100K-1M followers)</SelectItem>
                      <SelectItem value="mega">Mega (1M+ followers)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niche">Campaign Niche</Label>
                  <Select value={niche} onValueChange={setNiche}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Predicted Results</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Investment</span>
                    </div>
                    <p className="text-2xl font-bold">${predictions.investment.toLocaleString()}</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Predicted Return</span>
                    </div>
                    <p className="text-2xl font-bold">${predictions.predictedReturn.toLocaleString()}</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">ROI</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{predictions.predictedROI}%</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Est. Reach</span>
                    </div>
                    <p className="text-2xl font-bold">{predictions.estimatedReach.toLocaleString()}</p>
                  </div>
                </div>

                <Button className="w-full">Create Campaign with These Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Historical ROI Performance */}
          <Card>
            <CardHeader>
              <CardTitle>ROI Performance Trends</CardTitle>
              <CardDescription>Predicted vs actual ROI over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--secondary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Channel Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>ROI distribution by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  )
}
