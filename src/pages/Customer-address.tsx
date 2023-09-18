import { SidebarNav } from "@/components/sidebar-nav";
import { Separator } from "@radix-ui/react-select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { GET_CUSTOMER } from "@/graphql/customer";
import { useQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { redirectCustomerToLogin } from "@/lib/utils";

export default function CustomerAddress() {
  const navigate = useNavigate()
  const { data: customerData, loading: loadingCustomer } = useQuery(GET_CUSTOMER, {
    notifyOnNetworkStatusChange: true
  })

  if (!loadingCustomer && !customerData) {
    redirectCustomerToLogin(navigate)
  }

  return (
    <div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Customer</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">

            {(!loadingCustomer && customerData) && (
              <Table>
                <TableCaption>Additional Address Entries</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Street Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Zip/Postal Code</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    customerData.customer.addresses.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.firstname}</TableCell>
                        <TableCell>{item.lastname}</TableCell>
                        <TableCell>{item.street.toString()}</TableCell>
                        <TableCell>{item.city}</TableCell>
                        <TableCell>{item.country_code}</TableCell>
                        <TableCell>{item.region.region}</TableCell>
                        <TableCell>{item.telephone}</TableCell>
                        <TableCell>{item.postcode}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
            <div className="flex justify-end">
              <Link to="/customer/address/new" className={buttonVariants({ variant: "default" })}>Add New Address</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}