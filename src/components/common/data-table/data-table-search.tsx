import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

interface DataTableSearchProps {
  searchKey?: string;
  placeholder?: string;
  onSearchKeyChange?: (searchKey: string) => void;
}

const DataTableSearch = ({ searchKey, placeholder, onSearchKeyChange }: DataTableSearchProps) => {
  return (
    <div className="flex items-center">
      <div className="relative flex items-center flex-1 float-start">
        <Input
          placeholder={placeholder ?? 'Search'}
          className="w-full text-sm h-8 max-w-64 ps-10"
          value={searchKey ?? ''}
          onChange={(e) => onSearchKeyChange?.(e.target.value)}
        />
        <Search className="absolute w-4 h-4 shrink-0 text-slate-700 start-3" />
      </div>
    </div>
  );
};

export default DataTableSearch;
