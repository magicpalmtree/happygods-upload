export const getImage = (image: any) => {
  if (typeof image === 'string') {
    return 'data:image/jpeg;base64,' + image;
  }

  if (typeof image === 'object') {
    return URL.createObjectURL(image);
  }

  return undefined;
};
