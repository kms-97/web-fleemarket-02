import React, { useCallback, useEffect, useState } from "react";

interface Props {
  target: any[];
  contentPerPage?: number;
}

const DefaultContentPerPage = 10;

const usePagination = ({ target, contentPerPage = DefaultContentPerPage }: Props) => {
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    const totalPages = Math.ceil(target.length / contentPerPage);
    setTotalPage(totalPages);
  }, [target]);

  useEffect(() => {
    setHasNextPage(page < totalPage);
  }, [page, totalPage]);

  const nextPage = useCallback(() => {
    if (hasNextPage) setPage((prev) => prev + 1);
  }, [hasNextPage]);

  return {
    upperLimit: page * contentPerPage,
    hasNextPage,
    nextPage,
  };
};

export default usePagination;
