import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/utils/tailwind-utils';

type DataTableSkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * The number of columns in the table.
   * @type number
   */
  columnCount: number;

  /**
   * The number of rows in the table.
   * @default 10
   * @type number | undefined
   */
  rowCount?: number;

  /**
   * The number of searchable columns in the table.
   * @default 0
   * @type number | undefined
   */
  searchableColumnCount?: number;

  /**
   * The number of filterable columns in the table.
   * @default 0
   * @type number | undefined
   */
  filterableColumnCount?: number;

  /**
   * Flag to show the table view options.
   * @default undefined
   * @type boolean | undefined
   */
  showViewOptions?: boolean;

  /**
   * The width of each cell in the table.
   * The length of the array should be equal to the columnCount.
   * Any valid CSS width value is accepted.
   * @default ["auto"]
   * @type string[] | undefined
   */
  cellWidths?: string[];

  /**
   * Flag to show the pagination bar.
   * @default true
   * @type boolean | undefined
   */
  withPagination?: boolean;

  /**
   * Flag to prevent the table cells from shrinking.
   * @default false
   * @type boolean | undefined
   */
  shrinkZero?: boolean;
};

const DataTableSkeleton = (props: DataTableSkeletonProps) => {
  const {
    columnCount,
    rowCount = 10,
    searchableColumnCount = 0,
    filterableColumnCount = 0,
    showViewOptions = true,
    cellWidths = ['auto'],
    withPagination = true,
    shrinkZero = false,
    className,
    ...skeletonProps
  } = props;

  return (
    <div className={cn('w-full space-y-2.5 overflow-auto', className)} {...skeletonProps}>
      <div className="flex overflow-auto justify-between items-center p-1 space-x-2 w-full">
        <div className="flex flex-1 items-center space-x-2">
          {searchableColumnCount > 0
            ? Array.from({ length: searchableColumnCount }).map((_, i) => (
                <Skeleton key={i} className="w-40 h-7 lg:w-60" />
              ))
            : null}
          {filterableColumnCount > 0
            ? Array.from({ length: filterableColumnCount }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-[4.5rem] border-dashed" />
              ))
            : null}
        </div>
        {showViewOptions ? <Skeleton className="ml-auto hidden h-7 w-[4.5rem] lg:flex" /> : null}
      </div>
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            {Array.from({ length: 1 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableHead
                    key={j}
                    style={{
                      width: cellWidths[j],
                      minWidth: shrinkZero ? cellWidths[j] : 'auto',
                    }}
                  >
                    <Skeleton className="w-full h-6" />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell
                    key={j}
                    style={{
                      width: cellWidths[j],
                      minWidth: shrinkZero ? cellWidths[j] : 'auto',
                    }}
                  >
                    <Skeleton className="w-full h-6" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {withPagination ? (
        <div className="flex overflow-auto gap-4 justify-between items-center p-1 w-full sm:gap-8">
          <Skeleton className="w-40 h-7 shrink-0" />
          <div className="flex gap-4 items-center sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-24 h-7" />
              <Skeleton className="h-7 w-[4.5rem]" />
            </div>
            <div className="flex justify-center items-center text-sm font-medium">
              <Skeleton className="w-20 h-7" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="hidden size-7 lg:block" />
              <Skeleton className="size-7" />
              <Skeleton className="size-7" />
              <Skeleton className="hidden size-7 lg:block" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DataTableSkeleton;
