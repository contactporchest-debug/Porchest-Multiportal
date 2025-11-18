"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PortalLayout } from "@/components/portal-layout"
import { InfluencerSidebar } from "@/components/influencer-sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Loader2,
  Save,
  Plus,
  X,
  Instagram,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

// Form validation schema
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  category: z.string().min(2, "Category is required").max(100),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  contactEmail: z.string().email("Invalid email address"),
  brandPreferences: z.array(z.string()).default([]),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Constants
const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Brazil",
  "Mexico",
  "Japan",
  "South Korea",
  "China",
  "Other",
]

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Mandarin",
  "Japanese",
  "Korean",
  "Hindi",
  "Arabic",
  "Russian",
  "Other",
]

export default function InfluencerProfileSetup() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasInstagram, setHasInstagram] = useState(false)
  const [newLanguage, setNewLanguage] = useState("")
  const [newBrandPref, setNewBrandPref] = useState("")

  // Initialize form with react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      category: "",
      bio: "",
      country: "",
      city: "",
      languages: [],
      contactEmail: "",
      brandPreferences: [],
    },
  })

  useEffect(() => {
    fetchProfile()

    // Check for success/error messages
    const success = searchParams.get("success")
    const error = searchParams.get("error")

    if (success) {
      toast({
        title: "Success",
        description: success,
      })
      router.replace("/influencer/profile/setup")
    }

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      router.replace("/influencer/profile/setup")
    }
  }, [searchParams])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/influencer/profile")
      const data = await response.json()

      if (data.success && data.data?.profile) {
        const profile = data.data.profile
        const basicInfo = profile.basic_info || {}

        // Update form with existing data
        form.reset({
          name: basicInfo.name || "",
          category: basicInfo.category || "",
          bio: basicInfo.bio || "",
          country: basicInfo.country || "",
          city: basicInfo.city || "",
          languages: basicInfo.languages || [],
          contactEmail: basicInfo.email || session?.user?.email || "",
          brandPreferences: basicInfo.brand_preferences || [],
        })

        setHasInstagram(!!profile.instagram?.account_id)
      } else {
        // Pre-fill email from session
        form.setValue("contactEmail", session?.user?.email || "")
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setSaving(true)

      const response = await fetch("/api/influencer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basic_info: {
            name: values.name,
            category: values.category,
            bio: values.bio,
            country: values.country,
            city: values.city,
            languages: values.languages,
            email: values.contactEmail,
            brand_preferences: values.brandPreferences,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to save profile")
      }

      toast({
        title: "Success",
        description: "Profile saved successfully!",
      })

      // Refresh profile data
      await fetchProfile()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addLanguage = () => {
    if (newLanguage && !form.getValues("languages").includes(newLanguage)) {
      const currentLanguages = form.getValues("languages")
      form.setValue("languages", [...currentLanguages, newLanguage])
      setNewLanguage("")
    }
  }

  const removeLanguage = (lang: string) => {
    const currentLanguages = form.getValues("languages")
    form.setValue(
      "languages",
      currentLanguages.filter((l) => l !== lang)
    )
  }

  const addBrandPref = () => {
    if (
      newBrandPref &&
      !form.getValues("brandPreferences").includes(newBrandPref)
    ) {
      const currentPrefs = form.getValues("brandPreferences")
      form.setValue("brandPreferences", [...currentPrefs, newBrandPref])
      setNewBrandPref("")
    }
  }

  const removeBrandPref = (pref: string) => {
    const currentPrefs = form.getValues("brandPreferences")
    form.setValue(
      "brandPreferences",
      currentPrefs.filter((p) => p !== pref)
    )
  }

  const handleConnectInstagram = () => {
    window.location.href = "/api/meta/auth"
  }

  if (loading) {
    return (
      <PortalLayout
        sidebar={<InfluencerSidebar />}
        title="Profile Setup"
        userRole="Influencer"
        breadcrumbs={[{ label: "Profile Setup" }]}
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF7A00]" />
        </div>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout
      sidebar={<InfluencerSidebar />}
      title="Profile Setup"
      userRole="Influencer"
      breadcrumbs={[{ label: "Profile Setup" }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE - FORM */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card className="backdrop-blur-sm bg-white/90 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-[#FF7A00]">
                    Basic Information
                  </CardTitle>
                  <CardDescription>Tell us about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your full name"
                            {...field}
                            className="border-orange-200 focus:border-[#FF7A00]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category (Niche) *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Fashion, Travel, Tech, Fitness"
                            {...field}
                            className="border-orange-200 focus:border-[#FF7A00]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell brands about yourself..."
                            rows={4}
                            {...field}
                            className="border-orange-200 focus:border-[#FF7A00]"
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value.length}/500 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                            className="border-orange-200 focus:border-[#FF7A00]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="backdrop-blur-sm bg-white/90 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-[#FF7A00]">Location</CardTitle>
                  <CardDescription>Where are you based?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-orange-200 focus:border-[#FF7A00]">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your city"
                              {...field}
                              className="border-orange-200 focus:border-[#FF7A00]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card className="backdrop-blur-sm bg-white/90 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-[#FF7A00]">Languages *</CardTitle>
                  <CardDescription>What languages do you speak?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={newLanguage} onValueChange={setNewLanguage}>
                      <SelectTrigger className="flex-1 border-orange-200">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={addLanguage}
                      type="button"
                      size="sm"
                      className="bg-[#FF7A00] hover:bg-[#FF7A00]/90"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((lang) => (
                              <Badge
                                key={lang}
                                variant="secondary"
                                className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                              >
                                {lang}
                                <X
                                  className="ml-2 h-3 w-3 cursor-pointer"
                                  onClick={() => removeLanguage(lang)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Brand Preferences */}
              <Card className="backdrop-blur-sm bg-white/90 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-[#FF7A00]">
                    Brand Preferences
                  </CardTitle>
                  <CardDescription>
                    What types of brands do you prefer to work with?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newBrandPref}
                      onChange={(e) => setNewBrandPref(e.target.value)}
                      placeholder="e.g., Sustainable brands, Tech companies"
                      className="border-orange-200 focus:border-[#FF7A00]"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addBrandPref()
                        }
                      }}
                    />
                    <Button
                      onClick={addBrandPref}
                      type="button"
                      size="sm"
                      className="bg-[#FF7A00] hover:bg-[#FF7A00]/90"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="brandPreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((pref) => (
                              <Badge
                                key={pref}
                                variant="secondary"
                                className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                              >
                                {pref}
                                <X
                                  className="ml-2 h-3 w-3 cursor-pointer"
                                  onClick={() => removeBrandPref(pref)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Save Button */}
              <Button
                type="submit"
                disabled={saving}
                size="lg"
                className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Profile
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* RIGHT SIDE - INSTAGRAM CONNECTION */}
        <div className="space-y-6">
          <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 sticky top-4">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Instagram className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-purple-600">
                  Instagram Connection
                </CardTitle>
              </div>
              <CardDescription>
                Connect your Instagram Business account to auto-fill your
                metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasInstagram ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">
                        Instagram Connected
                      </p>
                      <p className="text-sm text-green-700">
                        Your metrics are synced
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/influencer/dashboard")}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-2">
                        Requirements:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>Instagram Business or Creator account</li>
                        <li>Facebook Page linked to Instagram</li>
                        <li>Admin access to the Facebook Page</li>
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={handleConnectInstagram}
                    type="button"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    size="lg"
                  >
                    <Instagram className="mr-2 h-5 w-5" />
                    Connect Instagram
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    We'll fetch your followers, engagement, demographics, and
                    post metrics
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="backdrop-blur-sm bg-white/90 border-orange-200">
            <CardHeader>
              <CardTitle className="text-sm text-[#FF7A00]">
                Tips for Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF7A00] mt-0.5">•</span>
                  <span>Complete your profile to increase brand visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF7A00] mt-0.5">•</span>
                  <span>Connect Instagram to auto-sync your metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF7A00] mt-0.5">•</span>
                  <span>Be specific about your niche and preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF7A00] mt-0.5">•</span>
                  <span>Keep your bio professional and engaging</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  )
}
