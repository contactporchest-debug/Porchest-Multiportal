"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import AdminSidebar from "@/components/admin-sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Download,
  Eye,
  Send,
  Calendar,
} from "lucide-react"

// Dynamic Recharts imports
const BarChart = dynamic<any>(
  () => import("recharts").then((m) => m.BarChart),
  { ssr: false }
)
const Bar = dynamic<any>(
  () => import("recharts").then((m) => m.Bar),
  { ssr: false }
)
const XAxis = dynamic<any>(
  () => import("recharts").then((m) => m.XAxis),
  { ssr: false }
)
const YAxis = dynamic<any>(
  () => import("recharts").then((m) => m.YAxis),
  { ssr: false }
)
const CartesianGrid = dynamic<any>(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false }
)
const Tooltip = dynamic<any>(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false }
)
const Legend = dynamic<any>(
  () => import("recharts").then((m) => m.Legend),
  { ssr: false }
)
const ResponsiveContainer = dynamic<any>(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
)

// Pending payments awaiting approval
const pendingPayments = [
  {
    id: "1",
    recipient: "Sarah Johnson",
    type: "Influencer Commission",
    campaign: "Summer Fashion Campaign",
    amount: 2500,
    requestedDate: "2025-06-15",
    status: "pending_approval",
  },
  {
    id: "2",
    recipient: "TechStyle Fashion",
    type: "Refund",
    campaign: "Spring Collection",
    amount: 5000,
    requestedDate: "2025-06-14",
    status: "pending_approval",
  },
  {
    id: "3",
    recipient: "Marcus Johnson",
    type: "Influencer Commission",
    campaign: "Tech Review Campaign",
    amount: 1800,
    requestedDate: "2025-06-13",
    status: "pending_approval",
  },
]

// All invoices
const invoices = [
  {
    id: "INV-2025-001",
    client: "TechCorp Solutions",
    type: "Software Development",
    amount: 25000,
    issueDate: "2025-06-01",
    dueDate: "2025-06-15",
    status: "paid",
  },
  {
    id: "INV-2025-002",
    client: "Startup Innovations",
    type: "Mobile App",
    amount: 30250,
    issueDate: "2025-06-05",
    dueDate: "2025-06-20",
    status: "pending",
  },
  {
    id: "INV-2025-003",
    client: "Global Enterprises",
    type: "API Integration",
    amount: 15000,
    issueDate: "2025-06-10",
    dueDate: "2025-06-25",
    status: "overdue",
  },
  {
    id: "INV-2025-004",
    client: "TechStyle Fashion",
    type: "Campaign Services",
    amount: 12500,
    issueDate: "2025-05-28",
    dueDate: "2025-06-12",
    status: "paid",
  },
]

// Commission records
const commissions = [
  {
    id: "1",
    influencer: "Sarah Johnson",
    campaign: "Summer Fashion Campaign",
    reach: 250000,
    engagement: 15000,
    commission: 2500,
    rate: "10%",
    paidDate: "2025-06-10",
    status: "paid",
  },
  {
    id: "2",
    influencer: "Marcus Johnson",
    campaign: "Tech Review Campaign",
    reach: 180000,
    engagement: 12000,
    commission: 1800,
    rate: "10%",
    paidDate: null,
    status: "pending",
  },
  {
    id: "3",
    influencer: "Amy Chen",
    campaign: "Beauty Launch",
    reach: 320000,
    engagement: 25000,
    commission: 3200,
    rate: "10%",
    paidDate: "2025-06-08",
    status: "paid",
  },
]

// All transactions
const transactions = [
  {
    id: "TXN-2025-001",
    type: "Payment Received",
    from: "TechCorp Solutions",
    to: "Porchest",
    amount: 25000,
    method: "Bank Transfer",
    date: "2025-06-14",
    status: "completed",
  },
  {
    id: "TXN-2025-002",
    type: "Commission Paid",
    from: "Porchest",
    to: "Sarah Johnson",
    amount: 2500,
    method: "PayPal",
    date: "2025-06-10",
    status: "completed",
  },
  {
    id: "TXN-2025-003",
    type: "Payment Received",
    from: "TechStyle Fashion",
    amount: 12500,
    method: "Credit Card",
    date: "2025-06-12",
    status: "completed",
  },
  {
    id: "TXN-2025-004",
    type: "Refund Issued",
    from: "Porchest",
    to: "Global Enterprises",
    amount: 3000,
    method: "Bank Transfer",
    date: "2025-06-11",
    status: "completed",
  },
]

// Monthly payment data
const monthlyData = [
  { month: "Jan", received: 125000, paid: 45000 },
  { month: "Feb", received: 135000, paid: 48000 },
  { month: "Mar", received: 150000, paid: 52000 },
  { month: "Apr", received: 142000, paid: 49000 },
  { month: "May", received: 168000, paid: 58000 },
  { month: "Jun", received: 182000, paid: 63000 },
]

export default function ContractsPayments() {
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            {status === "paid" ? "Paid" : "Completed"}
          </Badge>
        )
      case "pending":
      case "pending_approval":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge className="bg-red-500">
            <XCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleApprovePayment = (id: string) => {
    alert(`Payment ${id} approved and released`)
  }

  const handleRejectPayment = (id: string) => {
    alert(`Payment ${id} rejected`)
  }

  return (
    <PortalLayout
      sidebar={<AdminSidebar />}
      title="Contracts & Payments"
      userRole="Admin"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Contracts & Payments" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">$182,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-2xl font-bold">{pendingPayments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Commissions</p>
                  <p className="text-2xl font-bold">$63,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overdue Invoices</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Payment Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Overview</CardTitle>
            <CardDescription>Monthly payment received vs paid out</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="received" fill="#10b981" name="Received" />
                <Bar dataKey="paid" fill="#f97316" name="Paid Out" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Approval ({pendingPayments.length})</TabsTrigger>
            <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
            <TabsTrigger value="commissions">Commissions ({commissions.length})</TabsTrigger>
            <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
          </TabsList>

          {/* Pending Payments Approval */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Payment Approvals</CardTitle>
                <CardDescription>Review and approve or reject payment requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{payment.recipient}</h3>
                          <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                            <div>Type: {payment.type}</div>
                            <div>Campaign: {payment.campaign}</div>
                            <div>
                              <Calendar className="h-4 w-4 inline mr-1" />
                              Requested: {payment.requestedDate}
                            </div>
                            <div className="font-semibold text-lg text-foreground">
                              Amount: ${payment.amount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div>{getStatusBadge(payment.status)}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprovePayment(payment.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve & Release
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectPayment(payment.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Invoices */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Invoices</CardTitle>
                    <CardDescription>View and manage all invoices</CardDescription>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono">{invoice.id}</TableCell>
                        <TableCell className="font-medium">{invoice.client}</TableCell>
                        <TableCell>{invoice.type}</TableCell>
                        <TableCell className="font-semibold">${invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>{invoice.issueDate}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commissions */}
          <TabsContent value="commissions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Influencer Commissions</CardTitle>
                    <CardDescription>Track and manage commission payments</CardDescription>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Influencer</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Reach</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Paid Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell className="font-medium">{commission.influencer}</TableCell>
                        <TableCell>{commission.campaign}</TableCell>
                        <TableCell>{commission.reach.toLocaleString()}</TableCell>
                        <TableCell>{commission.engagement.toLocaleString()}</TableCell>
                        <TableCell>{commission.rate}</TableCell>
                        <TableCell className="font-semibold">${commission.commission.toLocaleString()}</TableCell>
                        <TableCell>{commission.paidDate || "-"}</TableCell>
                        <TableCell>{getStatusBadge(commission.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Transactions */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Transactions</CardTitle>
                    <CardDescription>Complete transaction history</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search transactions..."
                      className="w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono">{transaction.id}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.from}</TableCell>
                        <TableCell>{transaction.to || "-"}</TableCell>
                        <TableCell className="font-semibold">${transaction.amount.toLocaleString()}</TableCell>
                        <TableCell>{transaction.method}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}
