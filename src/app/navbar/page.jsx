"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { ModeToggle } from "@/components/mode-toggle" // make a mode toggle with shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const routes = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },

  { href: "/flashcard", label: "Flashcard" },

  { href: "/summaries", label: "Summaries" },

]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">AI</span>Summarizer
        </Link>

        {/* Center - Nav Links */}
        <nav className="hidden md:flex gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
            //   className={cn(
            //     "text-sm font-medium transition-colors hover:text-primary",
            //     pathname === route.href
            //       ? "text-primary"
            //       : "text-muted-foreground"
            //   )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Right - Search + Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Input
              type="search"
              placeholder="Search summaries..."
              className="h-9 w-[180px] md:w-[250px]"
            />
          </div>
          {/* <ModeToggle /> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
              <ThemeToggle/>

        </div>
      </div>
    </header>
  )
}
