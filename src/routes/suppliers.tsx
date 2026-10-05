import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Truck } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useShop } from "@/store/shop-store";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Suppliers — Furniture" },
      { name: "description", content: "Dummy supplier book for the furniture floor." },
    ],
  }),
  component: SuppliersPage,
});

function SuppliersPage() {
  const { ready, suppliers, addSupplier, deleteSupplier } = useShop();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [supplies, setSupplies] = useState("");

  const save = () => {
    if (!name.trim()) {
      toast.error("Supplier name is required.");
      return;
    }
    addSupplier({ name, phone, supplies });
    toast.success("Supplier saved on this device.");
    setName("");
    setPhone("");
    setSupplies("");
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-3 sm:p-4 md:p-8">
      <PageHeader
        title="Suppliers"
        subtitle="Mills and workshops that send stock. Saved locally."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Add supplier
          </Button>
        }
      />
      {!ready ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : suppliers.length === 0 ? (
        <EmptyState icon={Truck} title="No suppliers yet" description="Add a mill so purchases have a name." />
      ) : (
        <div className="panel overflow-x-auto">
          <Table className="min-w-[520px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Supplies</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.phone || "—"}</TableCell>
                  <TableCell>{supplier.supplies || "—"}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" aria-label={`Remove ${supplier.name}`} onClick={() => deleteSupplier(supplier.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add supplier</DialogTitle>
            <DialogDescription>Name, phone, and what they send.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="supplier-name">Name</Label>
              <Input id="supplier-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="supplier-phone">Phone</Label>
              <Input id="supplier-phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="supplier-supplies">Supplies</Label>
              <Input id="supplier-supplies" value={supplies} onChange={(event) => setSupplies(event.target.value)} placeholder="Chairs, tables" />
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
