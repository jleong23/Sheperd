import KidsCard from "./KidsCard";
import kidsData from "../../data/kids.json";
export default function KidsList() {
  return (
    <div className="p-8">
      <h2 className="text-5xl font-bold text-center my-8">Year 9 Listing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto ">
        {kidsData.map((kid) => (
          <KidsCard key={kid.id} kid={kid} />
        ))}
      </div>
    </div>
  );
}
