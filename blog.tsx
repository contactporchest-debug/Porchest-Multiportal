"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Heart, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Influencer Marketing in 2024",
    excerpt: "Discover the latest trends and strategies that will shape influencer marketing in the coming year.",
    image: "/placeholder.svg?height=250&width=400&text=Influencer+Marketing+2024",
    author: "Sarah Wilson",
    date: "2024-01-15",
    category: "Marketing Trends",
    likes: 42,
    comments: 8,
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Building Authentic Brand Partnerships",
    excerpt: "Learn how to create meaningful collaborations that resonate with your audience and drive real results.",
    image: "/placeholder.svg?height=250&width=400&text=Brand+Partnerships",
    author: "Michael Chen",
    date: "2024-01-12",
    category: "Brand Strategy",
    likes: 38,
    comments: 12,
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Social Media Analytics That Matter",
    excerpt: "Cut through the noise and focus on the metrics that actually impact your business growth.",
    image: "/placeholder.svg?height=250&width=400&text=Social+Media+Analytics",
    author: "Emily Rodriguez",
    date: "2024-01-10",
    category: "Analytics",
    likes: 56,
    comments: 15,
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Creative Campaign Ideas for Small Businesses",
    excerpt: "Budget-friendly creative strategies that can help small businesses compete with larger brands.",
    image: "/placeholder.svg?height=250&width=400&text=Creative+Campaigns",
    author: "David Thompson",
    date: "2024-01-08",
    category: "Creative",
    likes: 29,
    comments: 6,
    readTime: "4 min read",
  },
  {
    id: 5,
    title: "The Psychology of Social Media Engagement",
    excerpt: "Understanding what drives people to engage with content and how to leverage these insights.",
    image: "/placeholder.svg?height=250&width=400&text=Social+Psychology",
    author: "Lisa Park",
    date: "2024-01-05",
    category: "Psychology",
    likes: 67,
    comments: 23,
    readTime: "8 min read",
  },
  {
    id: 6,
    title: "Video Content Strategies for 2024",
    excerpt: "From short-form to long-form content, discover the video strategies that will dominate this year.",
    image: "/placeholder.svg?height=250&width=400&text=Video+Content+2024",
    author: "Alex Johnson",
    date: "2024-01-03",
    category: "Video Marketing",
    likes: 45,
    comments: 11,
    readTime: "6 min read",
  },
]

export function Blog() {
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  return (
    <section id="blog" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest <span className="text-white">Insights</span>
          </h2>
          <div className="w-20 h-1 bg-gray-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Stay updated with the latest trends, strategies, and insights from the world of digital marketing and brand
            building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">{post.author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </CardHeader>

              <CardContent>
                <p className="text-gray-900 mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center space-x-1 hover:text-gray-600 transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 ${likedPosts.includes(post.id) ? "fill-current text-gray-600" : ""}`}
                      />
                      <span>{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>

                  <Button variant="ghost" size="sm" className="text-white hover:text-black hover:bg-white/10 p-0">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-3">View All Posts</Button>
        </div>
      </div>
    </section>
  )
}
