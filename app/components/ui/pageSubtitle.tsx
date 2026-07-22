import { LucideIcon } from "lucide-react"

export type SubTitleType = {
    description: string
    Icon: LucideIcon
}

export function PageSubTitle({ description, Icon }: SubTitleType) {
    return (
        <div className="flex items-center gap-2">
            <div className="p-2 bg-[#19324d1f] rounded-xl text-primary">
                <Icon />
            </div>
            <h2 className="text-gray-800 font-semibold">{description}</h2>
        </div>
    )
}