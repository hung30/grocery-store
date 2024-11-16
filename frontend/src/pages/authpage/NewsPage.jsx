import { useEffect, useState } from "react";
import authorizedAxiosInstance from "../../utils/authorizedAxios";

function NewsPage() {
  const [news, setNews] = useState("");
  useEffect(() => {
    const getNews = async () => {
      try {
        const res = await authorizedAxiosInstance.get(
          "http://localhost:5000/v1/test"
        );
        setNews(res.data?.message);
      } catch (error) {
        console.log(error);
      }
    };
    getNews();
  }, []);
  return <div>NewsPage: {news}</div>;
}

export default NewsPage;
