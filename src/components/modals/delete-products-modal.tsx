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
import { QueryKeys } from '@/constants';
import { IProduct } from '@/types/mock-data.types';
import { useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Trash } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

type DeleteProductsModalProps = React.ComponentPropsWithoutRef<typeof Dialog> & {
  products: Row<IProduct>['original'][];
  showTrigger?: boolean;
  onSuccess?: () => void;
};

const DeleteProductsModal = ({
  products,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteProductsModalProps) => {
  const queryClient = useQueryClient();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        const deletedCount = products.length;

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
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Remove ({products.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently remove your{' '}
            <span className="font-medium">{products.length}</span>
            {products.length === 1 ? ' product' : ' products'} from our servers.
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
