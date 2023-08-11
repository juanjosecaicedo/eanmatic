import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";


const GET_PRODUCT_DETAILS = gql`
  query  GetProducs($filter: ProductAttributeFilterInput!){
    products (filter: $filter ) {
      items {
        id
        name
        sku
        image {
          url
          label
        }
        small_image{
          url
          label
        }
      }
    }
  }
`;

export default function ProductView() {
  const { id, sku } = useParams()
  const { data, loading, error } = useQuery(GET_PRODUCT_DETAILS, {
    variables: {
      filter: {
        sku: {
          eq: sku
        }
      }
    }
  })

  if (loading) {
    return (
      <>Loadign...</>
    )
  }

  if (error) {
    return (
      <>Error! {error.message}</>
    )
  }

  console.log(data);
  return (
    <div>
      <p>{id}</p>
      
    </div>
  )
}