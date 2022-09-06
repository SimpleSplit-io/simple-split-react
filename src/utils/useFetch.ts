import { useEffect, useState } from "react";

const cache: { [index: string]: any } = {};
const fetching = new Set<string>();

const useFetch = (url: string) => {
  const [status, setStatus] = useState<"idle" | "fetching" | "done">("idle");
  const [data, setData] = useState(undefined);

  const fetchData = () => {
    setStatus("fetching");
    if (fetching.has(url) && !cache[url]) {
      return;
    }
    if (cache[url]) {
      const data = cache[url];
      setData(data);
      setStatus("done");
    }
    fetching.add(url);
    fetch(url)
      .then((resp) => {
        if (resp.ok) {
          resp.json().then((data) => {
            cache[url] = data;
            setData(data);
            setStatus("done");
            fetching.delete(url);
          });
          return;
        }
        setStatus("done");
        fetching.delete(url);
      })
      .catch(() => {
        console.error("Simple Split Error: Could not execute fetch");
        setStatus("done");
        fetching.delete(url);
      });
  };

  useEffect(() => {
    if (!url) return;
    fetchData();
  }, [url]);
  return { status, data };
};

export default useFetch;
