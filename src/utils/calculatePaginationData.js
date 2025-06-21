export const calculatePaginationData = (count, perPage, page) => {
  const totalPage = Math.ceil(count / perPage);
  const hasNextPage = Boolean(totalPage - page);
  const hasPreviousPage = page !== 1;

  return {
    page,
    perPage,
    totalItems: count,
    totalPage,
    hasNextPage,
    hasPreviousPage,
  };
};