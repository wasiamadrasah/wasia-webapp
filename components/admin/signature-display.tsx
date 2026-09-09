import Image from "next/image"

type SignatureDisplayProps = {
  signatureUrl: string | null | undefined
  altText?: string
}

export function SignatureDisplay({ signatureUrl, altText = "Signature" }: SignatureDisplayProps) {
  if (!signatureUrl || signatureUrl.trim() === "") {
    return (
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Signature</p>
        <div className="mt-2 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-background">
          <p className="text-xs font-semibold text-muted-foreground">No signature</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Signature</p>
      <div className="relative mt-2 h-24 w-full overflow-hidden rounded-xl border-2 border-border bg-white dark:bg-slate-100 p-2 shadow-2xs">
        <Image
          src={signatureUrl}
          alt={altText}
          fill
          unoptimized
          className="object-contain p-1"
        />
      </div>
    </div>
  )
}
