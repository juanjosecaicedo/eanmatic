import { useQuery } from "@apollo/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Product } from "@/interfaces/Product"
import { Link } from "react-router-dom"
import ProductVariations from "@/components/product-variations"
import { Loader2 } from "lucide-react"
import { GET_PRODUCTS } from "@/graphql/product"
import { getCurrencySymbol, getStoreLocale } from "@/lib/utils"

export default function Home() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  if (loading) {
    return (
      <div className="mt-10 flex justify-center">
        <Loader2 className="mr-2 h-10 w-10 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-10">
        `Error! ${error.message}`
      </div>
    );
  }
  const locale = getStoreLocale()
  const { items } = data.products;
  return (
    <>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((product: Product) => (
            <Card className="" key={product.id}>
              <CardHeader className="p-0">
                <img
                  src={product.image.url}
                  alt={product.image.url}
                  width={352}
                  height={427}
                />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <Link to={'/product/id/' + product.id + '/sku/' + product.sku + '/url/' + product.url_key} className={buttonVariants({ variant: "link" }) + ' px-0'}> {product.name} </Link>
                </CardDescription>
                <span className="text-sm">SKU: <strong>{product.sku}</strong></span>
                <div className="flex">
                  <span>{getCurrencySymbol(locale, product.price_range.maximum_price.final_price.currency)}{product.price_range.maximum_price.final_price.value} </span>
                </div>
                <ProductVariations variants={product.variants} configurableOptions={product.configurable_options} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}