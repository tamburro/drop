import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  href?: string
  cta?: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div className={cn("grid w-full auto-rows-[18rem] grid-cols-3 gap-4", className)} {...props}>
      {children}
    </div>
  )
}

const BentoCard = ({ name, className, background, Icon, description, href, cta, ...props }: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card transform-gpu",
      className
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-8">
      <Icon className="h-10 w-10 origin-left text-accent transition-all duration-300 ease-in-out group-hover:scale-90" />
      <h3 className="mt-2 text-xl font-semibold text-foreground">{name}</h3>
      <p className="max-w-lg text-sm text-muted-foreground">{description}</p>
    </div>
    {href && cta && (
      <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-8 transform-gpu flex-row items-center p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <a href={href} className="pointer-events-auto inline-flex items-center text-sm font-medium text-accent">
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4" />
        </a>
      </div>
    )}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-accent/5" />
  </div>
)

export { BentoCard, BentoGrid }
