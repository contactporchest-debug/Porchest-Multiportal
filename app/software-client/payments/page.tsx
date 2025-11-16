"use client"

import { PortalLayout } from "@/components/portal-layout"
import { SoftwareClientSidebar } from "@/components/software-client-sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  DollarSign,
  Download,
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
} from "lucide-react"

// Invoice data
const invoices = [
  {
    id: "INV-2025-001",
    project: "E-Commerce Platform",
    amount: 25000,
    issueDate: "2025-06-01",
    dueDate: "2025-06-15",
    status: "paid",
    paidDate: "2025-06-12",
    description: "Development Phase 1 - Frontend Setup",
  },
  {
    id: "INV-2025-002",
    project: "E-Commerce Platform",
    amount: 30250,
    issueDate: "2025-06-15",
    dueDate: "2025-06-30",
    status: "paid",
    paidDate: "2025-06-28",
    description: "Development Phase 2 - Backend Integration",
  },
  {
    id: "INV-2025-003",
    project: "Mobile App Development",
    amount: 28000,
    issueDate: "2025-06-20",
    dueDate: "2025-07-05",
    status: "pending",
    description: "Design & Prototyping Phase",
  },
  {
    id: "INV-2025-004",
    project: "Mobile App Development",
    amount: 20000,
    issueDate: "2025-06-25",
    dueDate: "2025-07-10",
    status: "pending",
    description: "Development Phase 1",
  },
  {
    id: "INV-2024-015",
    project: "API Integration",
    amount: 15000,
    issueDate: "2025-05-01",
    dueDate: "2025-05-15",
    status: "paid",
    paidDate: "2025-05-14",
    description: "API Development & Testing",
  },
  {
    id: "INV-2024-016",
    project: "API Integration",
    amount: 18500,
    issueDate: "2025-05-20",
    dueDate: "2025-06-05",
    status: "paid",
    paidDate: "2025-06-03",
    description: "Deployment & Documentation",
  },
]

// Transaction history
const transactions = [
  {
    id: "TXN-2025-001",
    invoice: "INV-2025-002",
    amount: 30250,
    date: "2025-06-28",
    method: "Bank Transfer",
    status: "completed",
    reference: "REF123456789",
  },
  {
    id: "TXN-2025-002",
    invoice: "INV-2025-001",
    amount: 25000,
    date: "2025-06-12",
    method: "Wire Transfer",
    status: "completed",
    reference: "REF987654321",
  },
  {
    id: "TXN-2024-015",
    invoice: "INV-2024-016",
    amount: 18500,
    date: "2025-06-03",
    method: "Bank Transfer",
    status: "completed",
    reference: "REF456789123",
  },
  {
    id: "TXN-2024-014",
    invoice: "INV-2024-015",
    amount: 15000,
    date: "2025-05-14",
    method: "Wire Transfer",
    status: "completed",
    reference: "REF789123456",
  },
]

// Monthly payment data
const monthlyPaymentData = [
  { month: "Jan", paid: 35000, pending: 0 },
  { month: "Feb", paid: 42000, pending: 0 },
  { month: "Mar", paid: 38000, pending: 0 },
  { month: "Apr", paid: 45000, pending: 0 },
  { month: "May", paid: 33500, pending: 0 },
  { month: "Jun", paid: 55250, pending: 48000 },
]

// Payment breakdown by project
const projectPaymentData = [
  { project: "E-Commerce Platform", amount: 55250 },
  { project: "Mobile App Development", amount: 48000 },
  { project: "API Integration", amount: 33500 },
]

export default function PaymentInsights() {
  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0)
  const totalPending = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0)
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge className="bg-red-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-blue-500">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <PortalLayout
      sidebar={<SoftwareClientSidebar />}
      title="Payment Insights"
      userRole="Software Client"
      breadcrumbs={[{ label: "Dashboard", href: "/software-client" }, { label: "Payments" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Payment Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Invoiced</p>
                  <p className="text-2xl font-bold">${(totalInvoiced / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold">${(totalPaid / 1000).toFixed(0)}K</p>
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
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">${(totalPending / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Invoices</p>
                  <p className="text-2xl font-bold">{invoices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Payment Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <CardTitle>Monthly Payment Overview</CardTitle>
            </div>
            <CardDescription>Track your payment history over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyPaymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="paid" fill="#10b981" name="Paid" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Breakdown by Project */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Breakdown by Project</CardTitle>
            <CardDescription>Distribution of payments across active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectPaymentData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="project" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="amount" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Invoices and Transactions Tabs */}
        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History ({transactions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Invoice History</CardTitle>
                    <CardDescription>View and download all your invoices</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.project}</TableCell>
                        <TableCell className="max-w-xs truncate">{invoice.description}</TableCell>
                        <TableCell className="font-semibold">${invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>{invoice.issueDate}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Complete record of all payment transactions</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.invoice}</TableCell>
                        <TableCell className="font-semibold">${transaction.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {transaction.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            {transaction.method}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{transaction.reference}</TableCell>
                        <TableCell>{getTransactionStatusBadge(transaction.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common payment-related actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-24 flex-col gap-2" variant="outline">
                <Download className="h-6 w-6" />
                <span>Download All Invoices</span>
              </Button>
              <Button className="h-24 flex-col gap-2" variant="outline">
                <FileText className="h-6 w-6" />
                <span>View Payment Schedule</span>
              </Button>
              <Button className="h-24 flex-col gap-2" variant="outline">
                <CreditCard className="h-6 w-6" />
                <span>Update Payment Method</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
