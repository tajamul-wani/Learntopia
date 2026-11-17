/** The last `count` local day keys, oldest first, as "YYYY-MM-DD". */
export const lastDays = (count, from = new Date()) =>
  Array.from({ length: count }, (_, i) => {
    const d = new Date(from);
    d.setDate(d.getDate() - (count - 1 - i));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
