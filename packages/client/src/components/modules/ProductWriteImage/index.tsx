import React from "react";
import styled from "@emotion/styled";
import ImageButton from "@base/Image/ImageButton";

interface Props {
  images: string[];
  deleteImage: (index: number) => void;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const ProductWriteImage = ({ images, deleteImage, onChange }: Props) => {
  const SelectedImages = () => {
    return (
      <>
        {images.map((image, idx) => (
          <ImageButton type="delete" src={image} onClick={() => deleteImage(idx)} key={idx} />
        ))}
      </>
    );
  };

  return (
    <Container>
      <ImageInputLabel>
        <input type="file" accept="image/png, image/jpeg" multiple onChange={onChange} />
        <ImageButton type="add" count={images.length} />
      </ImageInputLabel>
      <SelectedImages />
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: row;
  column-gap: 16px;
  overflow: auto;

  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.COLOR.GRAY3};

  > * {
    flex-shrink: 0;
  }
`;

const ImageInputLabel = styled.label`
  > input {
    display: none;
  }
`;

export default ProductWriteImage;
