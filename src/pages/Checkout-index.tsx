//import { PaymentMethod } from "@/components/payment-method"
import { CardAccountLogin } from "@/components/card-login"
import ShippingAddresses from "@/components/shipping-addresses"
import Summary from "@/components/summary"

export default function Checkout() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="col-span-2">
          <div className="max-w-2xl">
            <CardAccountLogin />
            <ShippingAddresses />
          </div>
        </div>
        <div className="col-span-1">
          <Summary />
        </div>
      </div>
    </>
  )
}