import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PackagePlus } from "lucide-react";
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
import { formatMoney } from "@/lib/shop";
import { useShop } from "@/store/shop-store";

export const Route = createFileRoute("/purchases")({
  head: () => ({
    meta: [
      { title: "Purchases — Furniture" },
      { name: "description", content: "Receive stock from suppliers. Dummy, saved locally." },
    ],
  }),
  component: PurchasesPage,
});

function PurchasesPage() {
  const { ready, products, suppliers, purchases, addPurchase } = useShop();
  const [open, setOpen] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("1");
  const [cost, setCost] = useState("");

  const save = () => {
    const result = addPurchase({
      supplierName,
      productId,
      qty: Number(qty),
      cost: Number(cost || 0),
    });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Stock increased from this purchase.");
    setSupplierName("");
    setProductId("");
    setQty("1");
    setCost("");
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-3 sm:p-4 md:p-8">
      <PageHeader
        title="Purchases"
        subtitle="Inbound stock. Saving a purchase adds units to inventory."
        actions={
          <Button onClick={() => setOpen(true)}>
            <PackagePlus className="size-4" /> Receive stock
          </Button>
        }
      />
      {!ready ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : purchases.length === 0 ? (
        <EmptyState icon={PackagePlus} title="No purchases yet" description="Receive a delivery and stock goes up." />
      ) : (
        <div className="panel overflow-x-auto">
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{new Date(purchase.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{purchase.supplierName}</TableCell>
                  <TableCell className="font-medium">{purchase.productName}</TableCell>
                  <TableCell>{purchase.qty}</TableCell>
                  <TableCell>{formatMoney(purchase.cost)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive stock</DialogTitle>
            <DialogDescription>Units are added to the product in inventory and POS.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Supplier</Label>
              <Select value={supplierName} onValueChange={setSupplierName}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="purchase-qty">Quantity</Label>
                <Input id="purchase-qty" type="number" min={1} value={qty} onChange={(event) => setQty(event.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="purchase-cost">Cost (Rs)</Label>
                <Input id="purchase-cost" type="number" min={0} value={cost} onChange={(event) => setCost(event.target.value)} />
              </div>
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
