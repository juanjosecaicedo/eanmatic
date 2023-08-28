import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SET_PAYMENT_METHOD_AND_PLACE_ORDER } from "@/graphql/checkout"
import CookieManager from "@/lib/CookieManager"
import { namespaces } from "@/lib/utils"
import { useMutation } from "@apollo/client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AdyenPaymentMethodCreditCart() {

  const [cardNumber, setCardNumber] = useState('');
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [cvc, setCvc] = useState('')

  const [setPaymentMethodAndPlaceOrder, { loading: loadingPlaceOrder, error: errorPlaceOrder }] = useMutation(SET_PAYMENT_METHOD_AND_PLACE_ORDER)
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)
  const navigate = useNavigate();
  async function placeOrder() {
    console.log(cardNumber, month, year, cvc);

    const { data: dataPlaceOrder } = await setPaymentMethodAndPlaceOrder({
      variables: {
        input: {
          cart_id: cartId,
          payment_method: {
            code: "adyen_cc",
            adyen_additional_data_cc: {
              cc_type: "VI",
              stateData: "\"riskData\": {\n      \"clientData\": \"eyJ2ZXJzaW9uIjoiMS4wLjAiLCJkZXZpY2VGaW5nZXJwcmludCI6IkRwcXdVNHpFZE4wMDUwMDAwMDAwMDAwMDAwQ0VFTmF3UTQ4cDAwNDg3MTQ5NjBjVkI5NGlLekJHNW5xajJHdUZqZkJpeDdSWDNhejgwMDJtWmI3R2FVdzNKMDAwMDBUSXZqWDAwMDAwZklHZnpXWnN5S2dQMkR4c1lRSm06NDAiLCJwZXJzaXN0ZW50Q29va2llIjpbXSwiY29tcG9uZW50cyI6eyJ1c2VyQWdlbnQiOiJiOWQ3YzFhN2UzNjliODJmMjI1MWE0OTVlN2MwZGM1OSIsIndlYmRyaXZlciI6MCwibGFuZ3VhZ2UiOiJlbi1VUyIsImNvbG9yRGVwdGgiOjI0LCJkZXZpY2VNZW1vcnkiOjgsInBpeGVsUmF0aW8iOjEuMDE1NjI1LCJoYXJkd2FyZUNvbmN1cnJlbmN5IjoxNiwic2NyZWVuV2lkdGgiOjE4OTAsInNjcmVlbkhlaWdodCI6MTA2MywiYXZhaWxhYmxlU2NyZWVuV2lkdGgiOjE4OTIsImF2YWlsYWJsZVNjcmVlbkhlaWdodCI6MTA2NCwidGltZXpvbmVPZmZzZXQiOi0xODAsInRpbWV6b25lIjoiQWZyaWNhL0NhaXJvIiwic2Vzc2lvblN0b3JhZ2UiOjEsImxvY2FsU3RvcmFnZSI6MSwiaW5kZXhlZERiIjoxLCJhZGRCZWhhdmlvciI6MCwib3BlbkRhdGFiYXNlIjoxLCJwbGF0Zm9ybSI6IkxpbnV4IHg4Nl82NCIsInBsdWdpbnMiOiIyOWNmNzFlM2Q4MWQ3NGQ0M2E1YjBlYjc5NDA1YmE4NyIsImNhbnZhcyI6ImQ3MWQyNDU3MjVlZTQ2ZDdmMzZjMmQxZjc2NjFjODI1Iiwid2ViZ2wiOiIxMjkxZjQ1MjZlODFhNzkzZDU0MDdlNWYzODZlNDVhOSIsIndlYmdsVmVuZG9yQW5kUmVuZGVyZXIiOiJHb29nbGUgSW5jLiAoTlZJRElBKX5BTkdMRSAoTlZJRElBLCBWdWxrYW4gMS4zLjIzNiAoTlZJRElBIE5WSURJQSBSVFggQTUwMDAgTGFwdG9wIEdQVSAoMHgwMDAwMjRCNikpLCBOVklESUEpIiwiYWRCbG9jayI6MCwiaGFzTGllZExhbmd1YWdlcyI6MCwiaGFzTGllZFJlc29sdXRpb24iOjEsImhhc0xpZWRPcyI6MCwiaGFzTGllZEJyb3dzZXIiOjAsImZvbnRzIjoiOGM0NTAxYjdlNmUyM2Q0NTFhYmE0M2ViNWI2ZGQwYWIiLCJhdWRpbyI6IjkwMmYwZmU5ODcxOWI3NzllYTM3ZjI3NTI4ZGZiMGFhIiwiZW51bWVyYXRlRGV2aWNlcyI6IjVmM2ZkYWY0NzQzZWFhNzA3Y2E2YjdkYTY1NjAzODkyIn19\"\n    },\n    \"paymentMethod\": {\n      \"type\": \"scheme\",\n      \"holderName\": \"\",\n      \"encryptedCardNumber\": \"adyenjs_0_1_25$cLwaQDL3t8wMrYjwQ7tiO1rC4bjc+2cVUCPzX44eaQOM6nJeXlGxYDSmDNaTQHeBum7wRYkNjXWlsakEcVdGTViSgoui3I58ptzD5O3Pj6ravcm1xu/xftzcYKdOCp6oeuqsoZOOJlFkrYF3HLJB3Qm7TC3c7p3WNmqZ7KL4KBjg/rQ5El4S4c6KcF+Di1Z4CWPRQq1g0y0L1i1GPgJKqdadxRA/YFRadU0+mz2hesCXaTK2c+KDzPQmE5mSnbPaNJSDSf6QOWAeGsMjYgM+hJ5qyzP075hYfNHLIbXQ4Pb9kL5t9Nth82XP67CGmYzz/EE9FsAdi7Y2zHIjhGH+hQ==$UnDEOMrpxl2CHH7Rv3EMJSvyYBCKSBgM2wPo89UDuOnGj0vzTbQNUXUW2JMBtbfrKZl2ePB2qY667CGgKvLudYft1gaELZiDps7XtXI7W7yrTzazoVgKtDAQ8E6bFrBXq8Bjt5FwTLJ7YUgPWlNpm8Y/n3qxp4ROLmRSFbty+tAYWyMrcN5ubgdxaqGPKFlNxj/d1f06kEmlfjyb896BSbJ/FqAzYiQZAzu5ooNSpLqMWGfvQGwPn/NC6PvnLf6QQo2sYHWOEOep7oSqPJyY0grgYyfjZ7QXogfslfsRKxkswrAY6o2V7+7cAvUPuCDEP9gDu5wBzCexIBXkqTG5Dy40XhTj4Rd5dHbLk6H2glmjcOWIG1MUB/QJx9yclG5+rxqYiokNI5VveGB00w6hFyOUMGhlE/u3gN2Yn0grR0C0pGb8iKUzkGysjTA8CnjC0gpKrRO2SXOnsTusvbG/iaiO9enouhEsA9y2QQM4Z4S/FVKp62j9Kq++gioM1TBNM9qCKwJ10gaGjud7+nV1Sh/KeN9WuNLEGx6AqrZKkHN1P9T6mR3A10RxuZZcXBOwcRatDdafpTjo1oWajsAb45wV11AiKc+YWuSFgh63hr+meHAyJ207iEWhBJ16xQr2xXRMmbXJTuZFeYlkHXe31XEMm6yifLfka0DMufroL54yhJ12xLK6FNbGXK/w0KgJhL4gifb51KI938B8zkZbfj5t/pEy4Ng=\",\n      \"encryptedExpiryMonth\": \"adyenjs_0_1_25$oYCr1upQxj/mKGSRU1tAUwAEQFGPi8XuY2VNJMbJMVQOSwrKcYBufBXUMi8v6GbbTvLpikO/J2DTqZFrvabW+hA9gGy0GKtHhHGiqPs5jrMCF/u22of7iLF4IeZVq7CL0e/C7+Y0kzJCYg2uL89Ba5SLUtXVuqudpXOvIvRzYeyB+ycVf/j+yFN/47NQdqEQ8/OTDNX1LP/k1YIFG26KOPt/5fU3/+RUrNlB2FoRvUuAf0yi7tnUSoqBf1riPqUrKl2XAL6TlIzXA5NduU5Hn13MLPSidv8roYy0aXgKIp1kkqShszcvBa4aD0kAOeG1kSFmTqBi18Tbk8B/MZlW/Q==$ehuYrRdlOaQfH+2R9Z3zOT/6jhhpLM4dyNtds0lGfMYGiZiIO+f1r7p74NeIg8kSgRj0EWGa3MsNj0fCvx2VWvcUlpcMR7CZiF/fC5ADedczbHHuqvHFXS33JB8lN1z5T3gnjCu942N9/hKflA6/Qfs/mZ7iCFBL4JTte5d9LQOyh0Rj5YH+B33hHHkYvrYGlfA73NXFOKrN4a1IsHl8kJclx69tL4vY7PuC2HRLMvlQH0VoG65Pbf9i9gn4MWM5nF6MTxi9riIXODUqyPmDxUOqoECZiTAYX9nfY5if6m5PSAIGILJa38KYGE0C32E/CpLBiPn2VQ64ZdkzKUj2lGtYFzF1R8Wv/WFO/T3sxKWY8jU8MYqr5cLZ7n6PxoByApCFpiYMnCNNPc7FVzXjOsk9RS3SR8Ztzq5DLLC8c6xb35pW4bfF//OUEX1OgPq84fi+5coIkfL+hs/A\",\n      \"encryptedExpiryYear\": \"adyenjs_0_1_25$ATDTeF/HTTwotL4GOlJl7F4HpkNNShypv5sPvwWxM9vzDhiBVPzOc6S3KwqHcPVmc4U7+pb4Zjz6KQP3tNztQRgk2Rcmr3WwKLDY7ftUfn/nMvX4qntHlIIIdwXMyF1ZixdwkP+sAhgEOXRryV9roN9E+RGy+VxF3jD2LqGOHzJDHNcWu34yM1WzGbppf8fqSOMhR2yXMpkqUV3FnbxUsl65IwrRVh0zaXCl9fP92BdpXkc/XoUwrM90urBbs/j9gMcwXsQby0u+K0MXppZwUg/maLFG0n0TWuKtmfBS+ep0yWZUIC8zc/NrItxMErWYGthLnXEDwVoyQRiurn4SrA==$uv7s2f3L1J0fF8OpmDL5jr/0lZZRfSM3dmsx3uGN1xH8m9jPTipG0ay7LNHD7z34bQFHUPKkIQ/EynrriiirBij0de+Ar+HZR4HKea2oiYRcgLajVgiBsz2x6Kubod5Pcmj4UM6BTKNVgu35zsn9V3qrZCnE13Hpsg9FnZHqdadbDdjivJ4jA9Gv1Tc9vLIElreUU1koBijkiiVYdQRTSBTWEETR8GB6AsO480BILJlzP8R47swOY7JIjYFm8Q401m2LrIkBUs8p6l2yjbPBGonthNwTWie5NTyEqXRAU7cLNkAlMkqzMLSOYJsl71Xb3l2EsHktTYkfVSzAgwt4PNutLFpKOBAOWR6QRM1AHCFP8z0JU5ltKvJZ0DG2w63ET45OzGwu+inJrPgfWruJ83ILYEYqcoWqdvEy/MTMBdGS6+gIDkQbFYAHP282EFe7ccbDahOSE7+03Ek8nw==\",\n      \"encryptedSecurityCode\": \"adyenjs_0_1_25$koiSNwxd/JsxWF69XHcsC2T/aSZPGtv/JarLIw2Lre8UP1DzJWMPlJZOQfKBxrH0UytOm1bQt6JpFyOlYIU4Z5UX4Mz39zEnr/rMfSsQUAHNMoEGQVL2YQemkDFNS0xbfJskuHyTyOpu+dLvnRouf8PcRS9MTqQe0JKIKSrk4Mu2EDslhc2a9ui8PCX2MTTh+2DYQgPtPYdTaKJcLiKuXchXmmRfE9m4HoULP8jBzKXDhDh+eNKviQYfZtBmU08iGBDlqyiWhyj2tCTLHR8pP/mbIK+cE4QZ/YFW43MZcLYaq/rPcwyIRJShX2yqlcfyJh9y8ZyKeyNLPkEiR2Kk+Q==$INwAs3yEdrN1a+p839P/UxE4gR0EGKtW8njfeAJVVbQPaA6QvWeFyVI+TLhE3Qi1ngIYhTvY/ex0VSp2ulpsqbOj8TQenwbJiEhZZ3g8NRNjojWeyfRZpjIY43iKOjbhcTRq2vkoKu6KEa1WwWNx9k0SmTIZE6qvo0doAb1nAva6jpLYtFQ2L7E5/fDqzIvjhtOkFH4w6ajTZxLac2mfJhlaM1Hjx4RkgqCxPVxRPFt0ScSewbaKvkiDmHs5MrF6XTjsSjAUy9GZLAa11Kp8VkuBJCYAeQEBKmrecXaFcwY6aSx4gU8t5ldZSJTBJEwMmrfjfr8A/C2Rv2CzR2pIR/EIoFBrihIh/leuwc00BjCNW/ed5eLqU/MKCsHYp1uWBDe0rvIE/jFiaj0oHs/x2Pg9KQiNJMvapg9Tk2pOhc2CwuN9HJmgcQkO1hHRV73GS6EOHs6DwqU1Wga5vJypfMoe8fwVuLFqc2BZagMZqOx1fhMK+GS7TfhYv17PqYpUmIj5AxmF+Cm5iGwDg1Wy1Hjy0uc8YU4i4KSGkuGNtXaLbWVuPv9c8o6bvTNCK0o4FRA1jmBgk6TGnWA9C+CB3yJLp5c/VwYTWE8iQgCYGz15M9PqZWtcT1Nzwia6wOjPSUqLTYsTYU6dbI4Q+xN0eBbaMlxfi5rsH4YI/7sDw7fs2Q==\"\n    },\n    \"browserInfo\": {\n      \"acceptHeader\": \"*/*\",\n      \"colorDepth\": 24,\n      \"language\": \"en-US\",\n      \"javaEnabled\": false,\n      \"screenHeight\": 1063,\n      \"screenWidth\": 1890,\n      \"userAgent\": \"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36\",\n      \"timeZoneOffset\": -180\n    },\n    \"origin\": \"https://stg2.shop.lg.com\",\n    \"clientStateDataIndicator\": true"
            }
          }
        }
      }
    })

    const orderId = dataPlaceOrder.setPaymentMethodAndPlaceOrder.order.order_id
    CookieManager.createCookie(namespaces.checkout.lastOrder, orderId, 1)
    navigate('/checkout/success')
  }


  return (
    <div className="space-y-3 mt-5">
      <div className="grid gap-2">
        <Label htmlFor="number">Card number</Label>
        <Input id="number" placeholder="1234 5678 9012 3456" onChange={(event) => setCardNumber(event?.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="month">Expires</Label>
          <Select onValueChange={(value: string) => setMonth(value)}>
            <SelectTrigger id="month">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">January</SelectItem>
              <SelectItem value="2">February</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">June</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="year">Year</Label>
          <Select onValueChange={(value) => setYear(value)}>
            <SelectTrigger id="year">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i} value={`${new Date().getFullYear() + i}`}>
                  {new Date().getFullYear() + i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input id="cvc" placeholder="CVC" onChange={(event) => setCvc(event?.target.value)} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={() => placeOrder()} className="">Place Order</Button>
      </div>
    </div>
  )
}