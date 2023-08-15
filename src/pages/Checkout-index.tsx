import { PaymentMethod } from "@/components/payment-method"
import { CardAccountLogin } from "@/components/card-login"
import ShippingAddresses from "@/components/shipping-addresses"

export default function Checkout() {
  return (
    <>
      <div className="max-w-md">
        <CardAccountLogin />
        <ShippingAddresses />
        <PaymentMethod />
      </div>
    </>
  )
}