import { useState } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Image } from '@/interfaces/Product';

interface ProductViewGellery {
  mediaGallery: Image[]
}

export default function ProductViewGellery({ mediaGallery }: ProductViewGellery) {

  const [thumbsSwiper, setThumbsSwiper] = useState<null | SwiperClass>(null);

  return (
    <>
      <Swiper
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {mediaGallery.map((image: Image, index: number) => (
          <SwiperSlide key={`image-${index}`}>
            <img src={image.url} alt={image.url} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {mediaGallery.map((image: Image, index: number) => (
          <SwiperSlide key={`thumbs-${index}`}>
            <img src={image.url} alt={image.url} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}