"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type InterviewStatus = "\uC644\uB8CC" | "\uC9C4\uD589\uC911" | "\uC2E4\uD328"

interface Interview {
  date: string
  relation: string
  region: string
  duration: string
  status: InterviewStatus
  bookOrder: string | null
}

const STATUS_COMPLETE = "\uC644\uB8CC" as const
const STATUS_IN_PROGRESS = "\uC9C4\uD589\uC911" as const
const STATUS_FAILED = "\uC2E4\uD328" as const

const interviews: Interview[] = [
  { date: "2026.02.18", relation: "\uC5B4\uBA38\uB2C8", region: "\uC548\uB3D9", duration: "32\uBD84", status: STATUS_COMPLETE, bookOrder: "\u20A979,000" },
  { date: "2026.02.17", relation: "\uC544\uBC84\uC9C0", region: "\uC11C\uC6B8", duration: "28\uBD84", status: STATUS_COMPLETE, bookOrder: null },
  { date: "2026.02.17", relation: "\uD560\uBA38\uB2C8", region: "\uBD80\uC0B0", duration: "45\uBD84", status: STATUS_COMPLETE, bookOrder: "\u20A9199,000" },
  { date: "2026.02.16", relation: "\uC5B4\uBA38\uB2C8", region: "\uC81C\uC8FC", duration: "31\uBD84", status: STATUS_IN_PROGRESS, bookOrder: null },
  { date: "2026.02.16", relation: "\uD560\uC544\uBC84\uC9C0", region: "\uB300\uC804", duration: "38\uBD84", status: STATUS_COMPLETE, bookOrder: "\u20A979,000" },
  { date: "2026.02.15", relation: "\uC5B4\uBA38\uB2C8", region: "\uAD11\uC8FC", duration: "27\uBD84", status: STATUS_FAILED, bookOrder: null },
  { date: "2026.02.15", relation: "\uC544\uBC84\uC9C0", region: "\uC218\uC6D0", duration: "41\uBD84", status: STATUS_COMPLETE, bookOrder: "\u20A9199,000" },
  { date: "2026.02.14", relation: "\uD560\uBA38\uB2C8", region: "\uC778\uCC9C", duration: "35\uBD84", status: STATUS_COMPLETE, bookOrder: "\u20A979,000" },
]

const statusStyles: Record<InterviewStatus, string> = {
  [STATUS_COMPLETE]: "bg-emerald-100 text-emerald-700 border-emerald-200",
  [STATUS_IN_PROGRESS]: "bg-amber-100 text-amber-700 border-amber-200",
  [STATUS_FAILED]: "bg-red-100 text-red-700 border-red-200",
}

const HEADER_DATE = "\uB0A0\uC9DC"
const HEADER_RELATION = "\uAD00\uACC4"
const HEADER_REGION = "\uC9C0\uC5ED"
const HEADER_DURATION = "\uC18C\uC694\uC2DC\uAC04"
const HEADER_STATUS = "\uC0C1\uD0DC"
const HEADER_BOOK = "\uCC45\uC8FC\uBB38"
const CARD_TITLE = "\uCD5C\uADFC \uC778\uD130\uBDF0"

export function InterviewTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{CARD_TITLE}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{HEADER_DATE}</TableHead>
              <TableHead>{HEADER_RELATION}</TableHead>
              <TableHead>{HEADER_REGION}</TableHead>
              <TableHead>{HEADER_DURATION}</TableHead>
              <TableHead>{HEADER_STATUS}</TableHead>
              <TableHead className="text-right">{HEADER_BOOK}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interviews.map((interview, i) => (
              <TableRow key={i}>
                <TableCell className="text-muted-foreground">{interview.date}</TableCell>
                <TableCell className="font-medium">{interview.relation}</TableCell>
                <TableCell>{interview.region}</TableCell>
                <TableCell>{interview.duration}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyles[interview.status]}>
                    {interview.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {interview.bookOrder ?? <span className="text-muted-foreground">-</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
