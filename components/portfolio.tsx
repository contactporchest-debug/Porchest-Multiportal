// @ts-nocheck
"use client"

import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const Portfolio = () => {
  const [filter, setFilter] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)

  const categories = ["Category1", "Category2", "Category3"]
  const items = [
    {
      id: 1,
      category: "Category1",
      title: "Item 1",
      description: "Description 1",
      metrics: { reach: 1000, engagement: 50, conversions: 20 },
      testimonial: "Testimonial 1",
    },
    {
      id: 2,
      category: "Category2",
      title: "Item 2",
      description: "Description 2",
      metrics: { reach: 2000, engagement: 75, conversions: 30 },
      testimonial: "Testimonial 2",
    },
    {
      id: 3,
      category: "Category3",
      title: "Item 3",
      description: "Description 3",
      metrics: { reach: 3000, engagement: 100, conversions: 40 },
      testimonial: "Testimonial 3",
    },
  ]

  const filteredItems = items.filter((item) => item.category === filter || filter === "")

  return (
    <section id="portfolio" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-gray-300">Portfolio</span>
          </h2>
          <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore our successful campaigns and see how we've helped brands achieve remarkable results.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category)}
                className={`${
                  filter === category
                    ? "bg-white text-black hover:bg-gray-200"
                    : "border-white text-white hover:bg-white hover:text-black"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/10 border-white/20"
              onClick={() => setSelectedItem(item)}
            >
              <CardContent className="p-6">
                <div className="text-sm text-gray-400 font-semibold mb-2">{item.category}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{selectedItem.metrics.reach}</div>
                  <div className="text-gray-600">Total Reach</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{selectedItem.metrics.engagement}</div>
                  <div className="text-gray-600">Engagement Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{selectedItem.metrics.conversions}</div>
                  <div className="text-gray-600">Conversions</div>
                </div>
              </div>

              <blockquote className="bg-gray-100 p-6 rounded-lg border-l-4 border-black">
                <p className="text-gray-900 italic text-lg">"{selectedItem.testimonial}"</p>
              </blockquote>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Portfolio
