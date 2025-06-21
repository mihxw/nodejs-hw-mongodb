const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const isContactType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isContactType(type)) return type;
};

const parseFavorit = (value) => {
  const isValue = typeof value === 'string';
  if (!isValue) return;

  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  return;
};

export const parseFilterParams = (query) => {
  const { isFavourite, contactType } = query;

  const parsedType = parseContactType(contactType);
  const parsedFavorite = parseFavorit(isFavourite);

  return {
    isFavourite: parsedFavorite,
    contactType: parsedType,
  };
};