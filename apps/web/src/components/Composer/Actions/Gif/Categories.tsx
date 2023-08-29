import { GIPHY_KEY } from '@lenster/data/constants';
import type { Category } from '@lenster/types/giphy';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { For } from 'million/react';
import type { FC } from 'react';

interface CategoriesProps {
  setSearchText: (searchText: string) => void;
}

const Categories: FC<CategoriesProps> = ({ setSearchText }) => {
  const fetchGiphyCategories = async () => {
    try {
      const response = await axios.get(
        'https://api.giphy.com/v1/gifs/categories',
        { params: { api_key: GIPHY_KEY } }
      );

      return response.data.data;
    } catch (error) {
      return [];
    }
  };

  const { data: categories } = useQuery(['gifCategories'], () =>
    fetchGiphyCategories().then((res) => res)
  );

  return (
    <div className="grid w-full grid-cols-2 gap-1 overflow-y-auto">
      {categories && (
        <For each={categories}>
          {(category: Category) => (
            <button
              type="button"
              key={category.name_encoded}
              className="relative flex outline-none"
              onClick={() => setSearchText(category.name)}
            >
              <img
                className="h-32 w-full cursor-pointer object-cover"
                height={128}
                src={category.gif?.images?.original_still?.url}
                alt={category.name_encoded}
                draggable={false}
              />
              <div className="absolute bottom-0 right-0 w-full bg-gradient-to-b from-transparent to-gray-800 px-2 py-1 text-right text-lg font-bold text-white">
                <span className="capitalize">{category.name}</span>
              </div>
            </button>
          )}
        </For>
      )}
    </div>
  );
};

export default Categories;
