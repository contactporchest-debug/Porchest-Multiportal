"use client"

import { useEffect, useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import AdminSidebar from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Loader2, Shield } from "lucide-react"

interface AuditLog {
  _id: string
  user_id?: string
  user_info?: {
    email: string
    full_name?: string
    role: string
  }
  action: string
  entity_type: string
  entity_id?: string
  ip_address?: string
  user_agent?: string
  changes?: {
    before?: any
    after?: any
  }
  success: boolean
  error_message?: string
  timestamp: string
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")

  useEffect(() => {
    fetchLogs()
  }, [actionFilter])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: "100",
      })

      if (actionFilter && actionFilter !== "all") {
        params.append("action", actionFilter)
      }

      const response = await fetch(`/api/admin/audit-logs?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setLogs(data.data.logs || [])
      }
    } catch (err) {
      console.error("Error fetching audit logs:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter((log) =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entity_type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PortalLayout
      sidebar={<AdminSidebar />}
      title="Audit Logs"
      userRole="Admin"
      breadcrumbs={[{ label: "Audit Logs" }]}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>System Audit Trail</CardTitle>
                <CardDescription>
                  Monitor all critical system activities and changes
                </CardDescription>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search actions or entities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="user">User Actions</SelectItem>
                  <SelectItem value="campaign">Campaign Actions</SelectItem>
                  <SelectItem value="transaction">Transaction Actions</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal Actions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          <div className="space-y-2">
                            <Shield className="h-12 w-12 mx-auto text-muted-foreground/50" />
                            <p>No audit logs found</p>
                            <p className="text-sm">
                              Audit logs will appear here when critical actions are performed
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log._id}>
                          <TableCell className="font-mono text-sm">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>{log.entity_type}</TableCell>
                          <TableCell>
                            {log.user_info ? (
                              <div>
                                <div className="font-medium">{log.user_info.full_name || log.user_info.email}</div>
                                <div className="text-xs text-muted-foreground">{log.user_info.role}</div>
                              </div>
                            ) : (
                              "System"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={log.success ? "default" : "destructive"}>
                              {log.success ? "Success" : "Failed"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {log.ip_address || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {logs.length > 0 && (
                  <div className="mt-4 text-sm text-muted-foreground text-center">
                    Showing {filteredLogs.length} of {logs.length} audit logs
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
