// @ts-nocheck
"use client"
import { CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { Heart } from "lucide-react"
import { MessageCircle } from "lucide-react"
import { ArrowRight } from "lucide-react"

const Blog = ({ blogPosts, likedPosts, toggleLike }) => {
  return (
    <section id="blog" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Latest <span className="text-gray-300">Insights</span>
          </h2>
          <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest trends, strategies, and insights from the world of digital marketing and brand
            building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-white/10 border-white/20"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">{post.author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-gray-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </CardHeader>

              <CardContent>
                <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${likedPosts.includes(post.id) ? "fill-current text-white" : ""}`} />
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

export default Blog
