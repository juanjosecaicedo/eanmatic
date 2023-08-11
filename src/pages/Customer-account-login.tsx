import { CardAccountLogin } from "@/components/card-login";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "react-router-dom";

export default function CustomerAccountLogin() {
  return (
    <div className="mt-10">
      <div className="flex gap-24">
        <div className="flex-auto max-w-md">
          <CardAccountLogin />
        </div>
        <div className="flex-auto max-w-lg">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>Creating an account has many benefits: faster checkout, saving more than one address, order tracking and much more</CardDescription>
            </CardHeader>    
            <CardFooter>
            <Link to="/customer-account-create" className={buttonVariants({ variant: "default" })}>Create an account</Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}