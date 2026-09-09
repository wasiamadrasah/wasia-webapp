import Image from "next/image"

type ProfilePhotoDisplayProps = {
  photoUrl: string | null | undefined
  altText?: string
}

export function ProfilePhotoDisplay({ photoUrl, altText = "Profile photo" }: ProfilePhotoDisplayProps) {
  if (!photoUrl || photoUrl.trim() === "") {
    return (
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Profile Photo</p>
        <div className="mt-2 flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-border bg-background">
          <p className="text-xs font-semibold text-muted-foreground">No photo</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Profile Photo</p>
      <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-xl border-2 border-border bg-background shadow-2xs">
        <Image
          src={photoUrl}
          alt={altText}
          fill
          unoptimized
          className="object-cover"
        />
      </div>
    </div>
  )
}
