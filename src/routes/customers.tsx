import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Users } from "lucide-react";
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

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Furniture" },
      { name: "description", content: "Dummy customer book for the furniture floor." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { ready, customers, addCustomer, deleteCustomer } = useShop();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const save = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone are required.");
      return;
    }
    addCustomer({ name, phone, city });
    toast.success("Customer saved on this device.");
    setName("");
    setPhone("");
    setCity("");
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-3 sm:p-4 md:p-8">
      <PageHeader
        title="Customers"
        subtitle="Buyers who walk the floor. Saved locally, no server."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Add customer
          </Button>
        }
      />
      {!ready ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : customers.length === 0 ? (
        <EmptyState icon={Users} title="No customers yet" description="Add a buyer so the book is not empty." />
      ) : (
        <div className="panel overflow-x-auto">
          <Table className="min-w-[520px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.city || "—"}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" aria-label={`Remove ${customer.name}`} onClick={() => deleteCustomer(customer.id)}>
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
            <DialogTitle>Add customer</DialogTitle>
            <DialogDescription>Name, phone, and city stay on this browser.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="customer-name">Name</Label>
              <Input id="customer-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="customer-phone">Phone</Label>
              <Input id="customer-phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="customer-city">City</Label>
              <Input id="customer-city" value={city} onChange={(event) => setCity(event.target.value)} />
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
