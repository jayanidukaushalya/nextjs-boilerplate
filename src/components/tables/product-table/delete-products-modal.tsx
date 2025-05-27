'use client';

import type { Product } from '@/types/example-data.types';
import type { Row } from '@tanstack/react-table';

import type { ReactNode } from 'react';
import { useTransition } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QueryKeys } from '@/constants/query-keys.constants';

interface SelectionState {
  selectAll: boolean;
  selectedRows: Record<string, Product>;
  deselectedRows: Record<string, boolean>;
  selectedCount: number;
}

type DeleteProductsModalProps = React.ComponentPropsWithoutRef<typeof Dialog> & {
  products: Row<Product>['original'][] | Product[];
  onSuccess?: () => void;
  children?: ReactNode;
  selectionState?: SelectionState;
};

const DeleteProductsModal = ({
  products,
  onSuccess,
  children,
  selectionState,
  ...props
}: DeleteProductsModalProps) => {
  const queryClient = useQueryClient();
  const [isDeletePending, startDeleteTransition] = useTransition();

  // Determine the message to display based on selection state
  const getSelectionMessage = () => {
    if (selectionState?.selectAll) {
      // When selectAll is true, we're deleting all items except explicitly deselected ones
      const deselectedCount = Object.keys(selectionState.deselectedRows).length;
      if (deselectedCount > 0) {
        return `all products except ${deselectedCount} explicitly deselected item(s)`;
      } else {
        return 'all products';
      }
    } else {
      // Normal selection mode - just show the count
      return products.length === 1 ? '1 product' : `${products.length} products`;
    }
  };

  const onDelete = () => {
    startDeleteTransition(async () => {
      try {
        // In a real implementation, you would handle the selectAll case differently
        // For example, you might send a special flag to the server to delete all items
        // except the explicitly deselected ones
        const deletedCount = selectionState?.selectAll
          ? selectionState.selectedCount
          : products.length;

        props.onOpenChange?.(false);
        toast.success('Success', {
          description: `${deletedCount} Products are deleted successfully`,
        });
        await queryClient.invalidateQueries({
          queryKey: [QueryKeys.PRODUCTS],
        });
        onSuccess?.();
      } catch (error) {
        let message = 'An error occurred while deleting customers';
        if (error instanceof AxiosError) {
          message = error.response?.data?.message;
        }
        toast.error('Error', {
          description: message,
        });
      }
    });
  };

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently remove{' '}
            <span className="font-medium">{getSelectionMessage()}</span> from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Remove selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductsModal;
