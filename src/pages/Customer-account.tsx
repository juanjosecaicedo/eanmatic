import { SidebarNav } from "@/components/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { GET_CUSTOMER } from "@/graphql/customer"
import { httpLink } from "@/lib/ApolloConfig";
import { redirectCustomerToLogin, setHeaderToken } from "@/lib/utils";
import { useQuery } from "@apollo/client"
import { useNavigate } from "react-router-dom";

export default function CustomerAccount() {
  setHeaderToken()

  const { data: customerData, loading: customerLoading } = useQuery(GET_CUSTOMER)
  const navigate = useNavigate()

  if (!customerLoading && !customerData) {
    redirectCustomerToLogin(navigate)
    console.log(httpLink);

  }

  return (
    <>
      <p>Customer-account</p>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-2xl">

          </div>
        </div>
      </div>
    </>
  )
}