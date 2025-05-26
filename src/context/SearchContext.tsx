import React, { createContext, useContext, useState } from 'react';

type SearchContextType = {
    search: string;
    setSearch: (s: string) => void;
};

const SearchContext = createContext<SearchContextType>({
	search: '',
	setSearch: () => null,
});

export const useSearch = () => useContext(SearchContext);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [search, setSearch] = useState('');
	return (
		<SearchContext.Provider value={{ search, setSearch }}>
			{children}
		</SearchContext.Provider>
	);
};
