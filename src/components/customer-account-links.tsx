import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { Link } from "react-router-dom"

export default function CustomerAccountLinks() {
  //Poner parametro en magento Klarna
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-0">
          <User className="h-4 w-4" />
          <span className="ml-2">My account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <p className="text-center">My Account / Register</p>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/customer-account-login" className={buttonVariants({ variant: "default" }) + " w-full"}>Log in</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/customer-account-create" className={buttonVariants({ variant: "secondary" }) + " w-full"}>Register</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
