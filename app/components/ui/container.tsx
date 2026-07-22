import { cn } from "@/app/utils/cn";

export function Container(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div 
        {...props}
        className={cn(
        "mt-8 bg-white border border-gray-300 p-4 rounded-xl shadow-md space-y-4 w-full",
        props.className)
      }>
            {props.children}
        </div>
    )
}