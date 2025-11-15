"use client";

import { useState } from "react";
import { PortalLayout } from "@/components/portal-layout";
import { BrandSidebar } from "@/components/brand-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfluencerCard } from "@/components/brand/influencer-card";
import {
  Bot,
  Send,
  Loader2,
  Sparkles,
  DollarSign,
  Users,
  Target,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function InfluencerDiscovery() {
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState("");
  const [platform, setPlatform] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{ type: "user" | "bot"; content: string }>
  >([
    {
      type: "bot",
      content:
        "Hello! I'm your AI-powered influencer discovery assistant. Tell me about your campaign, and I'll help you find the perfect influencers!",
    },
  ]);

  const availableCategories = [
    "Fashion",
    "Beauty",
    "Tech",
    "Lifestyle",
    "Fitness",
    "Food",
    "Travel",
    "Gaming",
    "Business",
    "Health",
  ];

  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const searchInfluencers = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setChatHistory((prev) => [...prev, { type: "user", content: query }]);

    try {
      const response = await fetch("/api/brand/recommend-influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          budget: budget ? parseInt(budget) : null,
          categories,
          platform: platform || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations);
        setChatHistory((prev) => [
          ...prev,
          {
            type: "bot",
            content: `I found ${data.total} influencers matching your criteria. Here are the top recommendations sorted by relevance!`,
          },
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        },
      ]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <PortalLayout
      sidebar={<BrandSidebar />}
      title="AI Influencer Discovery"
      userRole="Brand Manager"
      breadcrumbs={[
        { label: "Dashboard", href: "/brand" },
        { label: "AI Discovery" },
      ]}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-1">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-[#ff7a00]" />
                AI Assistant
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-[#ff7a00] text-white"
                        : "bg-slate-700 text-slate-100"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-slate-100 rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </CardContent>

            <div className="border-t p-4 space-y-4">
              {/* Filters */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-slate-400">Budget (per post)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      placeholder="Max budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-slate-400">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Platform</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-slate-400 mb-2 block">
                    Categories
                  </Label>
                  <div className="flex flex-wrap gap-1">
                    {availableCategories.slice(0, 5).map((cat) => (
                      <Badge
                        key={cat}
                        variant={categories.includes(cat) ? "default" : "outline"}
                        className={`cursor-pointer text-xs ${
                          categories.includes(cat)
                            ? "bg-[#ff7a00] hover:bg-[#ff7a00]/90"
                            : ""
                        }`}
                        onClick={() => toggleCategory(cat)}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Describe your campaign..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchInfluencers()}
                  disabled={loading}
                />
                <Button
                  onClick={searchInfluencers}
                  disabled={loading || !query.trim()}
                  size="icon"
                  className="bg-[#ff7a00] hover:bg-[#ff7a00]/90"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#ff7a00]" />
                  Recommended Influencers
                </span>
                {recommendations.length > 0 && (
                  <Badge variant="secondary">
                    {recommendations.length} found
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">
                    No results yet
                  </h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Use the AI assistant to describe your campaign and discover
                    the perfect influencers for your brand!
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendations.map((influencer) => (
                    <InfluencerCard
                      key={influencer.id}
                      influencer={influencer}
                      onViewProfile={() => {
                        // Handle view profile - TODO: implement modal or navigation
                      }}
                      onSendRequest={() => {
                        // Handle send request - TODO: implement collaboration request
                      }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
