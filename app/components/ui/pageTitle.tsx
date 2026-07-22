import { LucideIcon } from "lucide-react"

export type PageTitleType = {
    title: string
    subtitle: string
    Icon: LucideIcon
}

export function PageTitle({ title, subtitle, Icon }: PageTitleType) {
    return (
        <div className="text-black">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Icon className="h-10 w-10 text-primary" />
                    <h1 className="text-3xl font-bold">{title}</h1>
                </div>
                <p className="text-sm">{subtitle}</p>
            </div>
        </div>
    )
}