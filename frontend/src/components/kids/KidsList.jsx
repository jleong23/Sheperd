import { useState, useEffect } from "react";
import KidsCard from "./KidsCard";
import { fetchKids } from "../../api/kids";
import AddKids from "./AddKids";

export default function KidsList() {
  const [kids, setKids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getKids() {
      try {
        const data = await fetchKids();
        setKids(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getKids();
  }, []);

  if (isLoading) {
    return <p className="text-center">Loading kids...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-8">
      <h2 className="text-5xl font-bold text-center my-8">Year 9 Listing</h2>
      <AddKids />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto ">
        {kids.map((kid) => (
          <KidsCard key={kid.id} kid={kid} />
        ))}
      </div>
    </div>
  );
}
