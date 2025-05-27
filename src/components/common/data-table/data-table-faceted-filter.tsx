import type { Option } from '@/types/data-table.types';

import { Check, PlusCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/tailwind-utils';

interface DataTableFacetedFilterProps {
  title?: string;
  options: Option[];
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  icon?: React.ComponentType<{ className?: string }>;
}

const DataTableFacetedFilter = ({
  title,
  options,
  selectedValues,
  onValuesChange,
  icon: FilterIcon,
}: DataTableFacetedFilterProps) => {
  const selected = new Set(selectedValues);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          {FilterIcon ? (
            <FilterIcon className="mr-2 size-4 opacity-60" />
          ) : (
            <PlusCircle className="mr-2 size-4 opacity-60" />
          )}
          {title}
          {selected.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="hidden space-x-1 lg:flex">
                {selected.size > 2 ? (
                  <Badge variant="secondary">{selected.size} selected</Badge>
                ) : (
                  options
                    .filter((option) => selected.has(option.value))
                    .map((option) => (
                      <Badge variant="secondary" key={option.value}>
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList className="max-h-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-[18.75rem] overflow-y-auto overflow-x-hidden">
              {options.map((option) => {
                const isSelected = selected.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const newSelected = new Set(selected);
                      if (isSelected) {
                        newSelected.delete(option.value);
                      } else {
                        newSelected.add(option.value);
                      }
                      onValuesChange(Array.from(newSelected));
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <Check className="size-4" aria-hidden="true" />
                    </div>
                    {option.icon && (
                      <option.icon
                        className="mr-2 size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                    <span className="capitalize">{option.label}</span>
                    {option.count && (
                      <span className="flex justify-center items-center ml-auto font-mono text-xs size-4">
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selected.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onValuesChange([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DataTableFacetedFilter;
