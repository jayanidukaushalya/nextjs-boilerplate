import { TableCell, TableRow } from '@/components/ui/table';
import { AlertTriangle } from 'lucide-react';

type DataTableErrorBannerProps = {
  error?: Error;
  columnLength: number;
};

const DataTableError = ({ error, columnLength }: DataTableErrorBannerProps) => {
  return (
    <TableRow>
      <TableCell
        colSpan={columnLength}
        className="h-24 space-y-1 font-semibold text-center bg-destructive/10 text-destructive/80"
      >
        <div className="flex flex-col items-center w-full">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <p>{error?.message ?? `Something went wrong.`}</p>
      </TableCell>
    </TableRow>
  );
};

export default DataTableError;
