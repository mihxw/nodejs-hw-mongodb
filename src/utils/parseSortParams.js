import { SORT_ORDER } from '../constants/index.js';

const parseSortOrser = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);

  if (isKnownOrder) return sortOrder;

  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const keyOfContacts = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
    'createdAt',
    'updatedAt',
  ];

  if (keyOfContacts.includes(sortBy)) return sortBy;

  return '_id';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrser(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};