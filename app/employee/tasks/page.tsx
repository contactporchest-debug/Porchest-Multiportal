"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle } from "lucide-react"
import PortalLayout from "@/components/portal-layout"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import { mockData } from "@/lib/mock-data"

export default function TaskBoard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const columns = [
    { id: "todo", title: "To Do", icon: Clock, color: "text-slate-600" },
    { id: "in-progress", title: "In Progress", icon: AlertCircle, color: "text-orange-600" },
    { id: "done", title: "Done", icon: CheckCircle, color: "text-green-600" },
  ]

  const tasks = mockData.employee.kanbanTasks

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <PortalLayout sidebar={<EmployeeSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Task Board</h1>
            <p className="text-muted-foreground">Manage your tasks with Kanban workflow</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task to your board</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input id="title" placeholder="Enter task title" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Task description" />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Create Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id)
            const Icon = column.icon

            return (
              <Card key={column.id} className="h-fit">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${column.color}`} />
                      <CardTitle className="text-lg">{column.title}</CardTitle>
                    </div>
                    <Badge variant="outline">{columnTasks.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {columnTasks.map((task) => (
                    <Card key={task.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{task.project}</span>
                          <span className="text-muted-foreground">Due: {task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-xs">{task.assignee.charAt(0)}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{task.assignee}</span>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </PortalLayout>
  )
}
