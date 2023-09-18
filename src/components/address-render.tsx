import { Address } from "@/interfaces/Customer"

interface Props {
  address: Address
}

export default function AddressRender({ address }: Props) {
  return (
    <>
      <ul className="font-normal flex flex-col gap-2">
        <li className="text-gray-500">Firstname: <span className="text-gray-600">{address.firstname}</span></li>
        <li className="text-gray-500">Lastname <span className="text-gray-600">{address.lastname}</span></li>
        <li className="text-gray-500">City: <span className="text-gray-600">{address.city}</span></li>
        <li className="text-gray-500">Company: <span className="text-gray-600">{address.company}</span></li>
        <li className="text-gray-500">Postcode: <span className="text-gray-600">{address.postcode}</span></li>
        <li className="text-gray-500">Tegion: <span className="text-gray-600">{address.region.region}</span></li>
        <li className="text-gray-500">Street: <span className="text-gray-600">{address.street.toString()}</span></li>
        <li className="text-gray-500">Telephone: <span className="text-gray-600">{address.telephone}</span></li>
      </ul>
    </>
  )
}
