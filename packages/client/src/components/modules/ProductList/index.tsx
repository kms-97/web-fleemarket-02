import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import ProductItem from "@modules/ProductItem";
import { IProductItem } from "types/product.type";
import usePagination from "@hooks/usePagination";

interface Props {
  products: IProductItem[];
  toggleWish: (...arg: any) => Promise<boolean | undefined>;
  deleteProduct: (...arg: any) => Promise<boolean | undefined>;
}

const ProductList = ({ products, toggleWish, deleteProduct }: Props) => {
  const { upperLimit, hasNextPage, nextPage } = usePagination({ target: products });
  const observer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          nextPage();
        }
      },
      { threshold: 0.8 },
    );
    if (observer.current) {
      io.observe(observer.current);
    }

    return () => {
      io && io.disconnect();
    };
  }, [hasNextPage]);

  return (
    <Container>
      {products &&
        products
          .filter((_, index) => index < upperLimit)
          .map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              toggleWish={toggleWish}
              deleteProduct={deleteProduct}
            />
          ))}
      {hasNextPage && <Observer ref={observer} />}
    </Container>
  );
};

const Container = styled.div`
  overflow: auto;
`;

const Observer = styled.div`
  padding: 20px 0;
`;

export default ProductList;
