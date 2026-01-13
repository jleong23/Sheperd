import KidsCard from "./KidsCard";

export function KidsGrid({ kids, selected, toggleSelect, bulkMode, refresh }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto mt-3">
      {kids.map((kid) => (
        <KidsCard
          key={kid.id}
          kid={kid}
          onKidDeleted={refresh}
          showCheckbox={bulkMode}
          isSelected={selected.includes(kid.id)}
          onSelect={toggleSelect}
        />
      ))}
    </div>
  );
}
