import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Text from "@base/Text";
import Input from "@base/Input";
import MapPinIcon from "@icons/MapPinIcon";
import { usePriceInput, useImageInput } from "@src/hooks";
import ProductWriteTitle from "@components/modules/ProductWriteTitle";
import ProductWriteImage from "@components/modules/ProductWriteImage";
import ProductWriteHeader from "@components/modules/ProductWriteHeader";

const categories = [
  { name: "디지털기기", img: "empty.jpg" },
  { name: "생활가전", img: "empty.jpg" },
  { name: "가구/인테리어", img: "empty.jpg" },
  { name: "게임/취미", img: "empty.jpg" },
  { name: "생활/가공식품", img: "empty.jpg" },
  { name: "스포츠/레저", img: "empty.jpg" },
  { name: "여성패션/잡화", img: "empty.jpg" },
  { name: "남성패션/잡화", img: "empty.jpg" },
  { name: "유아동", img: "empty.jpg" },
  { name: "뷰티/미용", img: "empty.jpg" },
  { name: "반려동물", img: "empty.jpg" },
  { name: "도서/티켓/음반", img: "empty.jpg" },
  { name: "식물", img: "empty.jpg" },
  { name: "기타 중고물품", img: "empty.jpg" },
];

const MAX_IMAGE_LIMIT = 10;

const ProductWritePage = () => {
  const { price, priceString, setPriceString } = usePriceInput("");
  const { images, addImages, deleteImage } = useImageInput(MAX_IMAGE_LIMIT);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkValidate();
  }, [selectedCategory, images]);

  const onClickSubmitButton: React.FormEventHandler = (e) => {
    e.preventDefault();
    console.log("");
  };

  const onChangeImageInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files) return;

    addImages(files);
  };

  const onClickCategoryBtn: React.MouseEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value;
    setSelectedCategory(value);
  };

  const checkValidate = () => {
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;
    const imageCount = images.length;

    if (title && selectedCategory && description && imageCount) setIsValid(true);
    else setIsValid(false);
  };

  return (
    <Container>
      <ProductWriteHeader isValid={isValid} onClick={onClickSubmitButton} />
      <Body>
        <ProductWriteImage
          images={images}
          deleteImage={deleteImage}
          onChange={onChangeImageInput}
        />
        <ProductWriteTitle
          categories={categories}
          selectedCategory={selectedCategory}
          checkValidate={checkValidate}
          onClickCategoryBtn={onClickCategoryBtn}
          ref={titleRef}
        />
        <PriceSection>
          <Input
            iSize="lg"
            placeholder="가격(선택 사항)"
            value={priceString}
            onChange={({ target: { value } }) => setPriceString(value)}
          />
        </PriceSection>
        <StyledTextArea
          placeholder="게시글 내용을 작성해주세요"
          ref={descriptionRef}
          onBlur={checkValidate}
        />
      </Body>
      <Footer>
        <MapPinIcon />
        <Text size="sm">장곡동</Text>
      </Footer>
    </Container>
  );
};

const Container = styled.form`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLOR.WHITE};

  > header {
    button {
      svg path {
        stroke: ${({ theme }) => theme.COLOR.PRIMARY1};
      }

      &:disabled {
        cursor: default;
        svg path {
          stroke: ${({ theme }) => theme.COLOR.GRAY3};
        }
      }
    }
  }
`;

const Body = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  padding: 0 16px;
`;

const PriceSection = styled.section`
  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.COLOR.GRAY3};

  > input {
    border: solid 1px transparent;
    padding: 0;
  }
`;

const StyledTextArea = styled.textarea`
  flex-grow: 1;
  margin: 24px 0;
  font-size: 16px;
  padding: 8px 0;

  resize: none;
  outline: none;

  &:focus,
  :active {
    border: 1px solid ${({ theme }) => theme.COLOR.PRIMARY1};
    border-radius: 8px;
  }
`;

const Footer = styled.footer`
  position: sticky;
  display: flex;
  bottom: 0px;
  padding: 8px 0px 8px 16px;
  column-gap: 4px;

  border-top: 1px solid ${({ theme }) => theme.COLOR.GRAY3};

  > svg {
    width: 16px;
    height: 16px;
  }
`;

export default ProductWritePage;
