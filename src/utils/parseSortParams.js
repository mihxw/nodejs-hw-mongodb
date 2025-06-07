import { sortList } from '../constants/index.js';

export const parseSortParams = ({ sortBy = 'name', sortOrder }, sortFields) => {
  const parsedSortOrder =
    Array.isArray(sortList) && sortList.includes(sortOrder?.toLowerCase())
      ? sortOrder.toLowerCase()
      : sortList[0];

  const parsedSortBy =
    Array.isArray(sortFields) && sortFields.includes(sortBy) ? sortBy : 'name';

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};