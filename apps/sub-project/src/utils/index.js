export const getFileExtensionFromUrl = (url) => {
  const match = url.match(/\.(\w+)$/);
  return match ? match[1] : "";
};

export const isImageURL = (url) => {
  return /.(jpg|jpeg|png|gif|bmp|JPG|PNG|GIF|BMP|JPEG)$/.test(url);
};

export const downloadFile = (url, fileName) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    });
};

export const swapArrayElements = (arr, indexA, indexB) => {
  arr.splice(indexB, 1, ...arr.splice(indexA, 1, arr[indexB]));
};
