import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { FINANCE_CATEGORIES, formatMoney, type FinanceKind } from "@/lib/shop";
import { useShop } from "@/store/shop-store";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Finance — Furniture" },
      { name: "description", content: "Dummy income and expenses for the furniture showroom." },
    ],
  }),
  component: FinancePage,
});

function FinancePage() {
  const { ready, finance, addFinance, deleteFinance } = useShop();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<FinanceKind>("expense");
  const [category, setCategory] = useState<string>(FINANCE_CATEGORIES[2]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const income = useMemo(
    () => finance.filter((entry) => entry.kind === "income").reduce((sum, entry) => sum + entry.amount, 0),
    [finance],
  );
  const expenses = useMemo(
    () => finance.filter((entry) => entry.kind === "expense").reduce((sum, entry) => sum + entry.amount, 0),
    [finance],
  );

  const save = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter an amount greater than 0.");
      return;
    }
    addFinance({ kind, category, amount: value, note });
    toast.success(kind === "income" ? "Income saved." : "Expense saved.");
    setAmount("");
    setNote("");
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-5 p-3 sm:p-4 lg:p-8">
      <PageHeader
        title="Finance"
        subtitle="POS sales are recorded as income. Add rent, salary and supplier costs yourself. Nothing leaves this device."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Add entry
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Income" value={ready ? formatMoney(income) : "—"} />
        <Stat label="Expenses" value={ready ? formatMoney(expenses) : "—"} />
        <Stat label="Profit" value={ready ? formatMoney(income - expenses) : "—"} />
      </div>

      <div className="panel overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {finance.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <StatusBadge tone={entry.kind === "income" ? "success" : "danger"}>{entry.kind}</StatusBadge>
                </TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell className="max-w-[280px] truncate text-muted-foreground">{entry.note || "—"}</TableCell>
                <TableCell className="text-right font-medium">
                  {entry.kind === "expense" ? "− " : ""}
                  {formatMoney(entry.amount)}
                </TableCell>
                <TableCell>
                  {entry.source === "manual" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete entry"
                      onClick={() => {
                        deleteFinance(entry.id);
                        toast.success("Entry removed");
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add finance entry</DialogTitle>
            <DialogDescription>A dummy record saved in this browser. POS sales are added on their own.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant={kind === "income" ? "default" : "outline"} onClick={() => setKind("income")}>
                Income
              </Button>
              <Button type="button" variant={kind === "expense" ? "default" : "outline"} onClick={() => setKind("expense")}>
                Expense
              </Button>
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FINANCE_CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="finance-amount">Amount (Rs)</Label>
              <Input id="finance-amount" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="finance-note">Note</Label>
              <Input id="finance-note" value={note} placeholder="Showroom rent, supplier bill…" onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold leading-tight sm:text-xl">{value}</p>
    </div>
  );
}
