import React, { useCallback, useState } from "react";
import { ReactSVG } from "react-svg";
import { debounce } from "lodash";
import SearchIcon from "../../assets/search.svg";
import "./index.css";

interface ISearchInputProps {
  onSearch: (search: string) => void;
}

const SearchInput = (props: ISearchInputProps) => {
  const [search, setSearch] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = useCallback(debounce(props?.onSearch, 500), []);

  return (
    <div className="search-input">
      <input
        type="text"
        placeholder="kategori ara..."
        value={search}
        onChange={handleSearch}
      />
      <ReactSVG
        src={SearchIcon}
        className="icon"
        beforeInjection={(svg) => {
          svg.setAttribute(
            "style",
            "width: 18px; height: 18px; fill: #5F5E5C;",
          );
        }}
      />
    </div>
  );
};

export default React.memo(SearchInput);
