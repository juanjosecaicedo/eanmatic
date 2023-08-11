import { PaymentMethod } from "@/components/payment-method"
import { CardAccountLogin } from "@/components/card-login"

export default function Checkout() {
  return (
    <>
      <div className="max-w-md">
        <CardAccountLogin />
        <PaymentMethod />
      </div>
    </>
  )
}