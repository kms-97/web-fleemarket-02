import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Image from "@base/Image";
import Indicator from "./Indicator";

interface Props {
  images: string[];
}

const Carousel = ({ images }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            setIndex(Number(target.dataset.idx ?? 0));
          }
        });
      },
      {
        root: container,
        threshold: 0.5,
      },
    );

    Array.from(container.children).forEach((img) => io.observe(img));
    return () => {
      io && io.disconnect();
    };
  }, []);

  return (
    <Container>
      <CarouselContainer ref={containerRef}>
        {images.map((image, idx) => (
          <Image size="gd" src={image} key={idx} idx={idx} />
        ))}
      </CarouselContainer>
      <Indicator totalIndex={images.length} currentIndex={index} />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const CarouselContainer = styled.div`
  position: relative;
  display: flex;
  overflow: auto;
  scroll-snap-type: x mandatory;

  div {
    scroll-snap-align: center;
  }
`;

export default Carousel;
