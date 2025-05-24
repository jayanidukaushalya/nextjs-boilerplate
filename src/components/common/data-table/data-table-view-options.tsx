'use client';

import type { Table } from '@tanstack/react-table';
import { Check, ChevronsUpDown, Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toSentenceCase } from '@/utils/common-utils';
import { cn } from '@/utils/tailwind-utils';

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>;
};

const DataTableViewOptions = <TData,>({ table }: DataTableViewOptionsProps<TData>) => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          aria-label="Toggle columns"
          variant="outline"
          role="combobox"
          size="sm"
          className="hidden gap-2 ml-auto h-8 focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-0 lg:flex"
        >
          <Settings2 className="size-4" />
          View
          <ChevronsUpDown className="ml-auto opacity-50 size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-44">
        <Command>
          <CommandInput placeholder="Search columns..." />
          <CommandList>
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup>
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                .map((column) => {
                  return (
                    <CommandItem
                      key={column.id}
                      onSelect={() => column.toggleVisibility(!column.getIsVisible())}
                    >
                      <span className="capitalize truncate">{toSentenceCase(column.id)}</span>
                      <Check
                        className={cn(
                          'ml-auto size-4 shrink-0',
                          column.getIsVisible() ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DataTableViewOptions;
