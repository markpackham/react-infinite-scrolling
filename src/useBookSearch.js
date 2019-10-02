import { useEffect, useState } from "react";
import axios from "axios";

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  /* prevent from making unwanted requests, especially if what we want can't be found */
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true), setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "http://openlibrary.org/serach.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(c => (cancel = c))
    }).then(res => {
      setBooks(prevBooks => {
        return [...prevBooks, res.data.docs.map(b => b.title)];
      });
      console.log(res.data);
    });
    return () =>
      cancel(e => {
        if (axios.isCancel(e)) return;
      });
  }, [query, pageNumber]);
  return null;
}
