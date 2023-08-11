import { useState } from 'react';
import { Value, ConfigurableOption, Variant, Product } from '@/interfaces/Product';
import { Button } from '@/components/ui/button';

interface ProductVariationsProps {
  configurableOptions?: ConfigurableOption[],
  variants: Variant[]
}

const ProductVariations = ({ configurableOptions, variants }: ProductVariationsProps) => {

  const [selectedValueColor, setSelectedValueColor] = useState<Value | null | undefined>(null)
  const [selectedValueSize, setSelectedValueSize] = useState<Value | null | undefined>(null)
  const [product, setProduct] = useState<Product | null>(null)

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
      const data = variants.find((variant: Variant) => variant.product.sku === matchingSkus[0])
      console.log(matchingSkus, data);
    }

  }

  return (
    <>
      <div>
        {configurableOptions.find((option: ConfigurableOption) => option.attribute_code === 'color').values.map((value: Value) => (
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
      <div>
        {configurableOptions.find((option: ConfigurableOption) => option.attribute_code === 'size').values.map((value: Value) => (
          <Button
            key={value.value_index}
            variant={selectedValueSize?.value_index !== value.value_index ? "outline" : "secondary"}
            size="sm" onClick={() => handleSize(value)}
            type='button'>
            {value.label}
          </Button>
        ))}
      </div>
    </>
  );
}


export default ProductVariations