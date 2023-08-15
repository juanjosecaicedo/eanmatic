import { useRef, useState } from 'react';
import { Value, ConfigurableOption, Variant } from '@/interfaces/Product';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface ProductVariationsProps {
  readonly configurableOptions: ConfigurableOption[],
  readonly variants: Variant[]
  showLabels?: boolean
  field?: object
}

const ProductVariations = ({ configurableOptions, variants, showLabels, field }: ProductVariationsProps) => {

  const [selectedValueColor, setSelectedValueColor] = useState<Value | null | undefined>(null)
  const [selectedValueSize, setSelectedValueSize] = useState<Value | null | undefined>(null)
  const [sku, setSku] = useState<string>('');
  const inputElement = useRef<HTMLInputElement | null>(null);


  const handleColor = (value: Value) => {
    if (value.value_index === selectedValueColor?.value_index) {
      setSelectedValueColor(null)
      return
    }
    setSelectedValueColor(value)
    findSku(value.value_index, selectedValueSize?.value_index)
  }

  const handleSize = (value: Value) => {
    if (value.value_index === selectedValueSize?.value_index) {
      setSelectedValueSize(null);
      return
    }

    setSelectedValueSize(value)
    findSku(selectedValueColor?.value_index, value.value_index)
  }

  //find porduc by index
  const findSku = (colorIndex: number | null | undefined, sizeIndex: number | null | undefined) => {

    if (typeof colorIndex == "undefined" && typeof sizeIndex == "undefined") {
      return;
    }

    const matchingSkus: string[] = [];

    // Valores que estamos buscando
    const targetColorValue = colorIndex;
    const targetSizeValue = sizeIndex;

    for (const variant of variants) {
      let colorAttribute = null;
      let sizeAttribute = null;

      // Buscar los atributos "color" y "size" en la variante actual
      for (const attribute of variant.attributes) {
        if (attribute.code === "color") {
          colorAttribute = attribute;
        } else if (attribute.code === "size") {
          sizeAttribute = attribute;
        }
      }

      // Verificar si los atributos cumplen con los valores buscados
      if (colorAttribute && colorAttribute.value_index === targetColorValue &&
        sizeAttribute && sizeAttribute.value_index === targetSizeValue) {
        matchingSkus.push(variant.product.sku);
      }
    }

    if (matchingSkus.length) {
      // const data = variants.find((variant: Variant) => variant.product.sku === matchingSkus[0])
      // console.log(data);

      //setSku(matchingSkus[0]);

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      if (inputElement.current) {
        nativeInputValueSetter?.call(inputElement.current, matchingSkus[0]);
        const event = new Event('change', { bubbles: true });
        inputElement.current?.dispatchEvent(event);
        setSku(matchingSkus[0]);
      }
    }
  }
  
  const colors: ConfigurableOption | undefined = configurableOptions?.find((option: ConfigurableOption) => option.attribute_code === 'color')
  const sizes = configurableOptions?.find((option: ConfigurableOption) => option.attribute_code === 'size')

  return (
    <>
      <div className='flex items-center gap-2'>
        {(showLabels) && (
          <span className='font-bold'>Size:</span>
        )}
        <div className='flex flex-wrap gap-1 my-1'>
          {colors?.values.map((value: Value) => (
            <Button
              key={value.value_index}
              variant={selectedValueColor?.value_index !== value.value_index ? "outline" : "secondary"}
              size="sm" onClick={() => handleColor(value)}
              type='button'
            >
              {value.label}
            </Button>
          ))}
        </div>
      </div>
      <div className='flex items-center gap-2 mt-0'>
        {(showLabels) && (
          <span className='font-bold'>Color:</span>
        )}

        <div className='flex flex-wrap gap-1 my-1'>
          {sizes?.values.map((value: Value) => (
            <Button
              key={value.value_index}
              variant={selectedValueSize?.value_index !== value.value_index ? "outline" : "secondary"}
              size="sm" onClick={() => handleSize(value)}
              type='button'>
              {value.label}
            </Button>
          ))}
        </div>
      </div>
      {field && (
        <div>
          <FormControl>
            <Input {...field} value={sku} className='hidden' ref={inputElement} />
          </FormControl>
          <FormMessage />
        </div>
      )}
    </>
  );
}


export default ProductVariations