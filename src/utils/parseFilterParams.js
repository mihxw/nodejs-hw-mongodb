// export const parseFilterParams = ({ type, isFavourite }) => {
//   const parsedType = type ? type : undefined;

//   const parsedFavorite = isFavourite ? isFavourite === 'true' : undefined;

//   return {
//     type: parsedType,
//     isFavourite: parsedFavorite,
//   };
// };

export const parseFilterParams = ({ type, isFavourite }) => {
  const parsedType = type ? type : undefined;
  const parsedFavorite = isFavourite ? isFavourite === 'true' : undefined;

  return {
    type: parsedType,
    isFavourite: parsedFavorite,
  };
};