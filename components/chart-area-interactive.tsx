"use client"

import { Card } from "@/components/ui/card"
import { useState } from "react"

export function ChartAreaInteractive() {
  const [activeTab, setActiveTab] = useState("monthly")

  const mockData = {
    monthly: [
      { name: "Jan", teachers: 45, events: 3, notices: 5 },
      { name: "Feb", teachers: 52, events: 4, notices: 6 },
      { name: "Mar", teachers: 48, events: 2, notices: 4 },
      { name: "Apr", teachers: 61, events: 5, notices: 7 },
      { name: "May", teachers: 55, events: 3, notices: 5 },
      { name: "Jun", teachers: 67, events: 6, notices: 8 },
    ],
    weekly: [
      { name: "Mon", teachers: 15, events: 1, notices: 2 },
      { name: "Tue", teachers: 18, events: 1, notices: 2 },
      { name: "Wed", teachers: 20, events: 1, notices: 3 },
      { name: "Thu", teachers: 17, events: 1, notices: 2 },
      { name: "Fri", teachers: 22, events: 2, notices: 3 },
      { name: "Sat", teachers: 12, events: 1, notices: 1 },
      { name: "Sun", teachers: 10, events: 0, notices: 1 },
    ],
  }

  const data = activeTab === "monthly" ? mockData.monthly : mockData.weekly

  const maxValue = Math.max(
    ...data.flatMap((d) => [d.teachers, d.events, d.notices])
  )

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Activity Overview</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeTab === "monthly"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-muted text-muted-foreground hover:bg-muted"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeTab === "weekly"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-muted text-muted-foreground hover:bg-muted"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  T: {item.teachers} E: {item.events} N: {item.notices}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                <div
                  style={{
                    width: `${(item.teachers / maxValue) * 100}%`,
                  }}
                  className="bg-blue-500 h-full"
                />
                <div
                  style={{
                    width: `${(item.events / maxValue) * 100}%`,
                  }}
                  className="bg-emerald-500 h-full"
                />
                <div
                  style={{
                    width: `${(item.notices / maxValue) * 100}%`,
                  }}
                  className="bg-amber-500 h-full"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-xs text-muted-foreground">Teachers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-xs text-muted-foreground">Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-xs text-muted-foreground">Notices</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
