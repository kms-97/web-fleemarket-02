import React from "react";
import Image from "@base/Image";

const CategorySvg = ({ svg }: any) => {
  return <Image size="sm" src={`data:image/svg+xml;utf8,${svg}`} />;
};

export default CategorySvg;
