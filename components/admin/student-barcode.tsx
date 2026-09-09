"use client"

import * as React from "react"
import JsBarcode from "jsbarcode"

type StudentBarcodeProps = {
  value: string
  className?: string
  width?: number
  height?: number
  displayValue?: boolean
  fontSize?: number
}

export function StudentBarcode({
  value,
  className = "",
  width = 1.4,
  height = 36,
  displayValue = true,
  fontSize = 12,
}: StudentBarcodeProps) {
  const svgRef = React.useRef<SVGSVGElement | null>(null)

  React.useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          width,
          height,
          displayValue,
          fontSize,
          margin: 4,
          background: "transparent",
          lineColor: "#0f172a",
          font: "inherit",
          fontOptions: "bold",
        })
      } catch (err) {
        console.error("Failed to render barcode:", err)
      }
    }
  }, [value, width, height, displayValue, fontSize])

  if (!value) return null

  return (
    <div className={`inline-flex flex-col items-center justify-center p-1.5 bg-white rounded-lg border border-border shadow-2xs ${className}`}>
      <svg ref={svgRef} className="max-w-full" />
    </div>
  )
}
