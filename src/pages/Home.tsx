import { useQuery, gql } from "@apollo/client"
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
import AddTocart from "@/components/add-to-cart"

const GET_PRODUCTS = gql`
  query GetProducts {
    products(
    filter: {},
    sort: {name: ASC},
    pageSize: 5,
    currentPage: 1
    ) {
      total_count
      items {
        name
        sku
        id
        image {
          url
          label
        }
        __typename
        ... on ConfigurableProduct {
            configurable_options {
            id
            attribute_id
            label
            position
            use_default
            attribute_code
            values {
              value_index
              label
            }
            product_id
          }
          variants {
            product {
              id          
              sku
              attribute_set_id
              ... on PhysicalProductInterface {
                weight
              }
              price_range{
                minimum_price{
                  regular_price{
                    value
                    currency
                  }
                }
              }
            }
            attributes {
              label
              code
              value_index
            }
          }        
        }
        url_key        
        price_range {
          maximum_price {
            regular_price {
              value
              currency
            }
            final_price {
              value
              currency
            }
            discount {
              amount_off
              percent_off
            }
          }
        }
      }
    }
  }
`

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

  console.log(data)

  const getCurrencySymbol = (locale: string, currency: string) => {
    return (0).toLocaleString(
      locale,
      {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    ).replace(/\d/g, '').trim()
  }

  const { items } = data.products;
  return (
    <>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                  <span>{getCurrencySymbol('en-US', product.price_range.maximum_price.final_price.currency)}{product.price_range.maximum_price.final_price.value} </span>
                </div>
                {product.__typename === "ConfigurableProduct" && (
                  <ProductVariations configurableOptions={product.configurable_options} variants={product.variants} />
                )}
                <AddTocart parentSku={product.sku} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}