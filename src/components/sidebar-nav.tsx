import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "react-router-dom"


export function SidebarNav() {
  const { pathname } = location;

  const items = [
    {
      title: "Profile",
      href: "/customer/account",
    },
    {
      title: "Address Book",
      href: "/customer/address/",
    },
  ]

  return (
    <nav
      className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}