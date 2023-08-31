import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import CookieManager from "@/lib/CookieManager";
import { namespaces, priceFormat } from "@/lib/utils";
import  moment from 'moment';

interface Props {
  action: string
}

export default function PaymentSusccesMultibanco({ action }: Props) {
  const data = JSON.parse(action);  
  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableHead>Shopper Reference</TableHead>
            <TableCell className="font-medium text-right">{CookieManager.getCookie(namespaces.checkout.lastOrder)}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Payment Reference</TableHead>
            <TableCell className="font-medium text-right">{data.reference}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Expiration Date</TableHead>
            <TableCell className="font-medium text-right">{moment(data.expiresAt).format('DD/MM/YYYY hh:mm:ss')}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Method</TableHead>
            <TableCell className="font-medium text-right" >{data.paymentMethodType}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableCell className="font-medium text-right">{priceFormat(data.totalAmount.value)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}