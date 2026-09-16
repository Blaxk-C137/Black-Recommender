"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter()
  return (
    <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1">
      <ArrowLeft className="size-4" />
      {label}
    </Button>
  )
}
