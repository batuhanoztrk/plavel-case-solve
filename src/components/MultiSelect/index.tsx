import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import SearchInput from "../SearchInput";
import "./index.css";

interface IMultiSelectProps {
  items: MultiSelectItem[];
  defaultSelectedItems?: string[];
  onSelectedItemsChange?: (selectedItems: string[]) => void;
}

export interface MultiSelectItem {
  key: string;
  value: string;
}

const MultiSelect = (props: IMultiSelectProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const items = useMemo(() => {
    const _items = [...props.items];
    const prioritized: MultiSelectItem[] = [];

    selectedItems.forEach((selectedItem) => {
      const index = _items.findIndex((item) => item.key === selectedItem);
      if (index !== -1) {
        prioritized.push(_items[index]);
        _items.splice(index, 1);
      }
    });

    if (search != "") {
      return prioritized.concat(
        _items.filter((item) =>
          item.value.toLowerCase().includes(searchText.toLowerCase()),
        ),
      );
    }

    return prioritized.concat(_items);
  }, [props.items, selectedItems, search]);

  useEffect(() => {
    if (props.defaultSelectedItems)
      setSelectedItems(props.defaultSelectedItems);
  }, [props.defaultSelectedItems]);

  useEffect(() => {
    if (props.onSelectedItemsChange) props.onSelectedItemsChange(selectedItems);
  }, [props.onSelectedItemsChange, selectedItems]);

  const clickHandler = useCallback(
    (key: string) => {
      if (selectedItems.includes(key)) {
        setSelectedItems((prevState) => prevState.filter((i) => i !== key));
      } else {
        setSelectedItems((prevState) => [...prevState, key]);
      }
    },
    [selectedItems],
  );

  return (
    <div className="multi-select">
      <h3>Kategoriler</h3>
      <SearchInput
        onSearch={(val) => {
          setSearchText(val);
        }}
      />
      <div className="items">
        {items.map((item) => {
          return (
            <div key={item.key} className="item">
              <label className="checkbox">
                {item.value}
                <input
                  checked={selectedItems.includes(item.key) || false}
                  type="checkbox"
                  onChange={() => {
                    clickHandler(item.key);
                  }}
                />
                <div className="checkmark"></div>
              </label>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          setSearch(searchText);
        }}
        className="search-button"
      >
        Ara
      </button>
    </div>
  );
};

export default React.memo(MultiSelect, (prevProps, nextProps) => {
  return (
    isEqual(prevProps.items, nextProps.items) &&
    isEqual(prevProps.defaultSelectedItems, nextProps.defaultSelectedItems)
  );
});
