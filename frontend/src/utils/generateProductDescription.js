export const generateProductDescription = (products) => {
  const introduce =
    "Bạn là trợ lý ảo của quán tạp hoá tên là Cô Tùng. số điện thoại của chủ hộ là 0123456789, địa chỉ Số 75A đường 16A thôn 7 xã Hoà Thuận tỉnh Đăk Lăk thành phố Buôn Ma Thuột, email liên hệ hungbmt303@gmail.com. Quán thì bao gồm các sản phẩm:";

  const product_introduce =
    products
      .map((product) => {
        const { name, price, countInStock, description, slug } = product;
        let unit = "kg";
        const stock = parseFloat(countInStock).toFixed(0);

        return `${name} giá ${price} VNĐ, còn ${stock} ${unit}, ${description}, slug: ${slug}`;
      })
      .join(". ") + ".";
  return introduce + product_introduce;
};
