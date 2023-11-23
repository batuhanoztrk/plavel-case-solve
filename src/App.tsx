import MultiSelect, { MultiSelectItem } from "./components/MultiSelect";
import { useEffect, useState } from "react";
import { uniq } from "lodash";
import "./app.css";

function App() {
  const [items, setItems] = useState<MultiSelectItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/items.json");
      const { data } = await response.json();

      const uniqueItems = uniq(data as string[]);

      setItems(
        uniqueItems.map((item: string) => ({
          key: item,
          value: item,
        })),
      );
    } catch (_) {
      setError("Veriler yüklenirken bir hata oluştu.");
    }
  };

  const getSelectedItems = () => {
    const selectedItems = localStorage.getItem("selectedItems");
    if (selectedItems) {
      setSelectedItems(JSON.parse(selectedItems));
    }
  };

  useEffect(() => {
    if (items.length) {
      getSelectedItems();
      setLoading(false);
    }
  }, [items]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app">
      {loading && <div className="info">Yükleniyor...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <MultiSelect
          items={items}
          defaultSelectedItems={selectedItems}
          onSelectedItemsChange={(selectedItems) => {
            localStorage.setItem(
              "selectedItems",
              JSON.stringify(selectedItems),
            );
          }}
        />
      )}
    </div>
  );
}

export default App;
