import React from "react";
import styled from "@emotion/styled";
import Image from "@base/Image";

interface Props {
  images: string[];
}

const Carousel = ({ images }: Props) => {
  return (
    <Container>
      {images.map((image, idx) => (
        <Image size="gd" src={image} key={idx} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  overflow: auto;
  scroll-snap-type: x mandatory;

  div {
    scroll-snap-align: center;
  }
`;

export default Carousel;
