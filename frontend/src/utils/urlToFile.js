export const urlToFile = async (url, filename, mimeType = "image/jpeg") => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${url}`);
    }

    const blob = await response.blob();
    const file = new File([blob], filename, { type: mimeType });
    return file;
  } catch (error) {
    console.error("Error converting URL to file:", error);
    throw new Error("Could not convert URL to file");
  }
};
