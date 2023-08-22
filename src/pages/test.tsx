import { Terminal } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useState } from "react"
import { Button } from "@/components/ui/button"


export default function Test() {

  const [alert, toggleAlert] = useState(false)
  const [_variant, setVariant] = useState("default")
  let text = 'Show alert'
  if (alert) {
    text = 'Hidde alert'
  }


  const colors = ["default", "success", "destructive"]



  return (
    <div>
      <ul>
        <li className="text-blue-400 md:text-8xl md:text-red-400">Li 1</li>
        <li className="">li 2</li>
        <li>li 3</li>
      </ul>
      <Button variant={"destructive"} onClick={() => toggleAlert(!alert)}>{text}</Button>

      <div className="mt-2 flex gap-4">
        {colors.map(color => (
          <Button key={color} variant={color} onClick={() => setVariant(color)}>{color}</Button>
        ))}
      </div>


      {alert && (
        <Alert className="mt-5" variant={_variant} >
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the cli.
          </AlertDescription>
        </Alert>
      )}

    </div>
  )
}