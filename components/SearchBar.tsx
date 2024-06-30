"use client";

import { Input } from "./ui/input";
import { Command, CommandInput } from "./ui/command";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  return (
    <div className="flex items-center border rounded-full w-full max-w-[500px]">
      <label htmlFor="searchBar">
        <CiSearch className="ml-3" />
      </label>

      <input
        type="search"
        id="searchBar"
        placeholder="Find a topic..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-[transparent] outline-none w-full py-1 px-3"
      />

      <span className="text-xs bg-gray-700 py-0.5 px-2 mr-4 rounded-sm">⌘F</span>
    </div>
  );
}
