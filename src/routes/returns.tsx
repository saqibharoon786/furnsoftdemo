import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useShop } from "@/store/shop-store";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns — Furniture" },
      { name: "description", content: "Customer returns put stock back. Dummy, saved locally." },
    ],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  const { ready, products, returns, addReturn } = useShop();
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("1");
  const [reason, setReason] = useState("");

  const save = () => {
    const result = addReturn({ productId, qty: Number(qty), reason });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Returned units are back in stock.");
    setProductId("");
    setQty("1");
    setReason("");
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-3 sm:p-4 md:p-8">
      <PageHeader
        title="Returns"
        subtitle="A return puts the piece back on the floor and raises stock."
        actions={
          <Button onClick={() => setOpen(true)}>
            <RotateCcw className="size-4" /> Log return
          </Button>
        }
      />
      {!ready ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : returns.length === 0 ? (
        <EmptyState icon={RotateCcw} title="No returns yet" description="Log a return and the product stock goes up." />
      ) : (
        <div className="panel overflow-x-auto">
          <Table className="min-w-[520px]">
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returns.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{entry.productName}</TableCell>
                  <TableCell>{entry.qty}</TableCell>
                  <TableCell>{entry.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log a return</DialogTitle>
            <DialogDescription>Quantity is added back to inventory.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Product</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="return-qty">Quantity</Label>
              <Input id="return-qty" type="number" min={1} value={qty} onChange={(event) => setQty(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="return-reason">Reason</Label>
              <Input id="return-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Wrong size, scratch…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
