import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type DataTableSearchProps = {
  searchKey?: string;
  placeholder?: string;
  onSearchKeyChange?: (searchKey: string) => void;
};

const DataTableSearch = ({ searchKey, placeholder, onSearchKeyChange }: DataTableSearchProps) => {
  return (
    <div className="flex items-center min-w-80">
      <div className="relative flex items-center flex-1 float-start">
        <Input
          placeholder={placeholder ?? 'Search'}
          className="w-full text-sm max-w-80 ps-10"
          value={searchKey ?? ''}
          onChange={(e) => onSearchKeyChange?.(e.target.value)}
        />
        <Search className="absolute w-4 h-4 shrink-0 text-slate-700 start-3" />
      </div>
    </div>
  );
};

export default DataTableSearch;
