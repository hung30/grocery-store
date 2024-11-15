export const formatDate = (date) => {
  const optionsDate = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const datePart = new Date(date).toLocaleDateString("vi-VN", optionsDate);
  const timePart = new Date(date).toLocaleTimeString("vi-VN", optionsTime);

  return `${datePart}, ${timePart}`;
};
