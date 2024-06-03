import React, { useRef, useState } from "react";
import { connectSearchBox } from "instantsearch.js/es/connectors";
import Image from "next/image";
import IcSearch from "@/public/icons/ic_search.png";
import {
  UseSearchBoxProps,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch-core";

export default function ProductSearchBox(props: UseSearchBoxProps) {
  const { query, refine } = useSearchBox(props);
  const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  function setQuery(newQuery: string) {
    setInputValue(newQuery);

    refine(newQuery);
  }

  return (
    <form
      noValidate
      action=""
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (inputRef.current) {
          inputRef.current.blur();
        }
      }}
      onReset={(event) => {
        event.preventDefault();
        event.stopPropagation();

        setQuery("");

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }}
      className="w-full flex gap-4 items-center mb-6 px-4 py-4 border-b border-b-gray-300 lg:w-96 lg:mb-20 "
    >
      <Image
        src={IcSearch}
        alt="photo"
        width={20}
        height={20}
        className="w-4 h-4 shrink-0"
      />
      <input
        ref={inputRef}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Search"
        spellCheck={false}
        type="search"
        value={inputValue}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
        }}
        className="w-full paragraph-1 text-gray-800 placeholder-gray-300"
      />
    </form>
  );
}
