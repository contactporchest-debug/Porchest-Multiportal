"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Instagram,
  Youtube,
  Twitter,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface InfluencerCardProps {
  influencer: {
    id: string;
    name: string;
    bio?: string;
    profilePicture?: string;
    socialMedia?: any;
    totalFollowers: number;
    engagementRate: number;
    categories?: string[];
    primaryPlatform?: string;
    pricing?: {
      post?: number;
      story?: number;
      video?: number;
      reel?: number;
    };
    rating: number;
    completedCampaigns: number;
    predictedROI: number;
    predictedReach: number;
  };
  onViewProfile?: () => void;
  onSendRequest?: () => void;
}

export function InfluencerCard({
  influencer,
  onViewProfile,
  onSendRequest,
}: InfluencerCardProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "youtube":
        return <Youtube className="w-4 h-4" />;
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border-2 border-[#ff7a00]">
              <AvatarImage src={influencer.profilePicture} />
              <AvatarFallback className="bg-[#ff7a00] text-white">
                {influencer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                {influencer.name}
                {influencer.socialMedia?.[influencer.primaryPlatform?.toLowerCase() || "instagram"]?.verified && (
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                )}
              </h3>
              {influencer.primaryPlatform && (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  {getPlatformIcon(influencer.primaryPlatform)}
                  <span>{influencer.primaryPlatform}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-semibold text-white">
              {influencer.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        {influencer.bio && (
          <p className="text-sm text-slate-300 line-clamp-2">{influencer.bio}</p>
        )}

        {/* Categories */}
        {influencer.categories && influencer.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {influencer.categories.slice(0, 3).map((category, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-[#ff7a00]/10 text-[#ff7a00] text-xs"
              >
                {category}
              </Badge>
            ))}
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Users className="w-3 h-3" />
              <span>Followers</span>
            </div>
            <p className="text-white font-semibold">
              {formatNumber(influencer.totalFollowers)}
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <TrendingUp className="w-3 h-3" />
              <span>Engagement</span>
            </div>
            <p className="text-white font-semibold">
              {influencer.engagementRate.toFixed(2)}%
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <DollarSign className="w-3 h-3" />
              <span>Cost/Post</span>
            </div>
            <p className="text-white font-semibold">
              {influencer.pricing?.post
                ? formatCurrency(influencer.pricing.post)
                : "N/A"}
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <TrendingUp className="w-3 h-3" />
              <span>Predicted ROI</span>
            </div>
            <p className="text-green-500 font-semibold">
              {influencer.predictedROI.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{influencer.completedCampaigns} campaigns completed</span>
          <span>~{formatNumber(influencer.predictedReach)} reach</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
          onClick={onViewProfile}
        >
          View Profile
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-gradient-to-r from-[#ff7a00] to-coral-500"
          onClick={onSendRequest}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Send Request
        </Button>
      </CardFooter>
    </Card>
  );
}
