"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ExternalLink } from "lucide-react"
import Image from "next/image"

const portfolioItems = [
  {
    id: 1,
    title: "Fashion Brand Campaign",
    category: "Social Media",
    image: "/placeholder.svg?height=300&width=400&text=Fashion+Campaign",
    description: "Increased brand awareness by 300% through strategic influencer partnerships",
    metrics: {
      reach: "2.5M",
      engagement: "15%",
      conversions: "1,200",
    },
    testimonial: "WittyGo transformed our social media presence completely. The results exceeded our expectations!",
  },
  {
    id: 2,
    title: "Tech Startup Launch",
    category: "Brand Strategy",
    image: "/placeholder.svg?height=300&width=400&text=Tech+Startup",
    description: "Successfully launched a tech startup with comprehensive brand strategy and digital marketing",
    metrics: {
      reach: "1.8M",
      engagement: "22%",
      conversions: "850",
    },
    testimonial: "The strategic approach WittyGo provided was exactly what we needed for our launch.",
  },
  {
    id: 3,
    title: "E-commerce Growth",
    category: "Growth Hacking",
    image: "/placeholder.svg?height=300&width=400&text=E-commerce+Growth",
    description: "Achieved 400% revenue growth through innovative growth hacking strategies",
    metrics: {
      reach: "3.2M",
      engagement: "18%",
      conversions: "2,100",
    },
    testimonial: "Our revenue quadrupled thanks to WittyGo's innovative growth strategies.",
  },
  {
    id: 4,
    title: "Lifestyle Influencer Campaign",
    category: "Influencer Marketing",
    image: "/placeholder.svg?height=300&width=400&text=Lifestyle+Campaign",
    description: "Created viral content that generated massive organic reach and engagement",
    metrics: {
      reach: "5.1M",
      engagement: "25%",
      conversions: "3,500",
    },
    testimonial: "The campaign went viral beyond our wildest dreams. Amazing work!",
  },
  {
    id: 5,
    title: "Restaurant Chain Rebrand",
    category: "Creative Campaigns",
    image: "/placeholder.svg?height=300&width=400&text=Restaurant+Rebrand",
    description: "Complete rebrand and digital transformation for a restaurant chain",
    metrics: {
      reach: "1.5M",
      engagement: "20%",
      conversions: "900",
    },
    testimonial: "WittyGo gave our brand a fresh new identity that resonates with our customers.",
  },
  {
    id: 6,
    title: "Fitness App Promotion",
    category: "Analytics & Insights",
    image: "/placeholder.svg?height=300&width=400&text=Fitness+App",
    description: "Data-driven campaign optimization that doubled app downloads",
    metrics: {
      reach: "2.8M",
      engagement: "19%",
      conversions: "1,800",
    },
    testimonial: "The data insights provided helped us understand our audience better than ever.",
  },
]

export function Portfolio() {
  const [selectedItem, setSelectedItem] = useState<(typeof portfolioItems)[0] | null>(null)
  const [filter, setFilter] = useState("All")

  const categories = [
    "All",
    "Social Media",
    "Brand Strategy",
    "Growth Hacking",
    "Influencer Marketing",
    "Creative Campaigns",
    "Analytics & Insights",
  ]

  const filteredItems = filter === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === filter)

  return (
    <section id="portfolio" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-white">Portfolio</span>
          </h2>
          <div className="w-20 h-1 bg-gray-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto mb-8">
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
              className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ExternalLink className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardContent className="p-6">
                <div className="text-sm text-gray-400 font-semibold mb-2">{item.category}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-900 text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10"
                  onClick={() => setSelectedItem(null)}
                >
                  <X className="h-6 w-6" />
                </Button>

                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.title}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover"
                />

                <div className="p-8">
                  <div className="text-sm text-gray-400 font-semibold mb-2">{selectedItem.category}</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{selectedItem.title}</h3>
                  <p className="text-gray-900 text-lg mb-6">{selectedItem.description}</p>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{selectedItem.metrics.reach}</div>
                      <div className="text-gray-900">Total Reach</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{selectedItem.metrics.engagement}</div>
                      <div className="text-gray-900">Engagement Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{selectedItem.metrics.conversions}</div>
                      <div className="text-gray-900">Conversions</div>
                    </div>
                  </div>

                  <blockquote className="bg-gray-100 p-6 rounded-lg border-l-4 border-white">
                    <p className="text-gray-900 italic text-lg">"{selectedItem.testimonial}"</p>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
