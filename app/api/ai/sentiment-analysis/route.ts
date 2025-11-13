import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Sentiment Analysis API
 * Analyzes comments/text for sentiment (positive, neutral, negative)
 * In production, this would call a Python microservice with BERT/DistilBERT
 */

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { text, comments } = await req.json();

    if (!text && (!comments || comments.length === 0)) {
      return NextResponse.json(
        { error: "Text or comments array is required" },
        { status: 400 }
      );
    }

    // In production, this would call Python microservice:
    // const response = await fetch('http://ai-service:5000/analyze-sentiment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text, comments })
    // });

    // For now, use a simple rule-based approach
    const analyzeSentiment = (text: string) => {
      const positive = [
        "love", "great", "amazing", "excellent", "awesome", "fantastic",
        "wonderful", "good", "best", "beautiful", "perfect", "happy",
        "excited", "grateful", "impressed", "outstanding"
      ];
      const negative = [
        "hate", "bad", "terrible", "awful", "horrible", "worst", "poor",
        "disappointing", "sad", "angry", "annoyed", "frustrated", "useless"
      ];

      const lowerText = text.toLowerCase();
      let positiveScore = 0;
      let negativeScore = 0;

      positive.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) positiveScore += matches.length;
      });

      negative.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) negativeScore += matches.length;
      });

      if (positiveScore > negativeScore) return "positive";
      if (negativeScore > positiveScore) return "negative";
      return "neutral";
    };

    let results: any = {};

    if (text) {
      // Single text analysis
      results = {
        sentiment: analyzeSentiment(text),
        confidence: 0.75 + Math.random() * 0.2, // Mock confidence
      };
    } else if (comments) {
      // Batch analysis
      const analyzed = comments.map((comment: string) => ({
        text: comment,
        sentiment: analyzeSentiment(comment),
        confidence: 0.75 + Math.random() * 0.2,
      }));

      const sentimentCounts = {
        positive: analyzed.filter((a: any) => a.sentiment === "positive").length,
        neutral: analyzed.filter((a: any) => a.sentiment === "neutral").length,
        negative: analyzed.filter((a: any) => a.sentiment === "negative").length,
      };

      results = {
        total_analyzed: comments.length,
        sentiment_breakdown: sentimentCounts,
        positive_percentage: (sentimentCounts.positive / comments.length) * 100,
        negative_percentage: (sentimentCounts.negative / comments.length) * 100,
        neutral_percentage: (sentimentCounts.neutral / comments.length) * 100,
        overall_sentiment:
          sentimentCounts.positive > sentimentCounts.negative
            ? "positive"
            : sentimentCounts.negative > sentimentCounts.positive
            ? "negative"
            : "neutral",
        analyzed_comments: analyzed,
      };
    }

    return NextResponse.json({
      success: true,
      ...results,
      note: "Using rule-based analysis. In production, integrate BERT/DistilBERT model.",
    });
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
