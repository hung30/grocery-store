import { message } from "antd";
import React from "react";

const NewsPage = () => {
  const newsArticles = [
    {
      id: 1,
      title: "Lợi ích của đậu đen với sức khỏe",
      content:
        "Đậu đen giàu chất xơ và protein có thể giúp kiểm soát cân nặng, giữ đường ruột khỏe mạnh, điều chỉnh lượng đường trong máu. ",
      imageUrl:
        "https://res.cloudinary.com/dm8i7e2kw/image/upload/v1733211504/grocery_store/buoc-1-1-6250-1722657575-17291-6021-1843-1729136764_fooeyr.jpg",
    },
    {
      id: 2,
      title: "Các thực phẩm giúp cải thiện đau đầu",
      content:
        "Chuối, hạt bí, trà bạc hà, cà phê, nấm… có chứa magie, nước, chất oxy hóa làm giảm cơn đau đầu do nhiều nguyên nhân. ",
      imageUrl:
        "https://res.cloudinary.com/dm8i7e2kw/image/upload/v1733211629/grocery_store/freshstrawberriesbowlolddarkba-3507-2046-1683520673_vvbeol.jpg",
    },
    {
      id: 3,
      title: "5 loại carbohydrate tinh chế người tiểu đường nên hạn chế",
      content:
        "Chế độ ăn giàu carbohydrate (carb) tinh chế làm tăng lượng mỡ trong cơ thể, tăng nguy cơ béo phì, viêm và kháng insulin. Dưới đây là 5 loại carb tinh chế người bệnh tiểu đường nên tránh. Bánh mì trắng ít chất xơ, protein, vitamin và khoáng chất hơn bánh mì nguyên hạt, nhưng lại giàu carb dễ làm tăng đường huyết sau ăn.Người bệnh tiểu đường nên ăn các loại bánh mì làm từ ngũ cốc nguyên hạt như lúa mạch đen, yến mạch, lúa mì nguyên hạt để ít tác động đến lượng đường trong máu.",
      imageUrl:
        "https://res.cloudinary.com/dm8i7e2kw/image/upload/v1733211781/grocery_store/sack-rice-seed-with-white-rice-small-wooden-spoon-rice-plant-1706846027_zxdgw6.jpg",
    },
  ];

  return (
    <div className="container mx-auto p-4 text-center dark:bg-neutral-900">
      <h1 className="text-3xl font-bold mb-4 dark:text-white">
        Tin tức nóng hổi
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white p-4 rounded shadow border dark:bg-neutral-900 dark:text-white dark:border-white"
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className="mb-2 w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p>{article.content}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => message.warning("Đang phát triển")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Xem thêm
      </button>
    </div>
  );
};

export default NewsPage;
