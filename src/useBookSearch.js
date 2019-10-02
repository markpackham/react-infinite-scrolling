import { useEffect, useState } from "react";
import axios from "axios";

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  /* prevent from making unwanted requests, especially if what we want can't be found */
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(c => (cancel = c))
    })
      .then(res => {
        setBooks(prevBooks => {
          // a Set returns only unique values, we must remember to use the spread operator
          // to return things back to an array after using the Set
          return [
            ...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])
          ];
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
        console.log(res.data);
      })
      .catch(e => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () =>
      cancel(e => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
  }, [query, pageNumber]);
  return { loading, error, books, hasMore };
}
