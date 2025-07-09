export const formatDateToLocalDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateToString = (date: string | Date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatDateToStringWithoutYear = (date: string | Date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });
};
