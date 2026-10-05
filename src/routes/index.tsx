import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { formatMoney, stockLabel, stockTone, type ShopProduct } from "@/lib/shop";
import { useShop } from "@/store/shop-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "POP — Furniture" },
      { name: "description", content: "Add products in POP. They show in POS and inventory." },
    ],
  }),
  component: ProductUploadPage,
});

const NEW_CATEGORY = "__new__";

type FormState = {
  name: string;
  category: string;
  newCategory: string;
  sellingPrice: string;
  stock: string;
  description: string;
  image: string;
  published: boolean;
};

const emptyForm = (category = "Chairs"): FormState => ({
  name: "",
  category,
  newCategory: "",
  sellingPrice: "",
  stock: "1",
  description: "",
  image: "",
  published: true,
});

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 900;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => reject(new Error("Could not read that image."));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function ProductUploadPage() {
  const { ready, categories, products, addProduct, updateProduct, deleteProduct } = useShop();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ShopProduct | null>(null);
  const [toDelete, setToDelete] = useState<ShopProduct | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const rows = useMemo(() => products, [products]);
  const resolvedCategory = form.category === NEW_CATEGORY ? form.newCategory.trim() : form.category;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(categories[0] ?? "Chairs"));
    setOpen(true);
  };

  const openEdit = (product: ShopProduct) => {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      newCategory: "",
      sellingPrice: String(product.sellingPrice),
      stock: String(product.stock),
      description: product.description,
      image: product.image,
      published: product.published,
    });
    setOpen(true);
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    try {
      const image = await readImage(file);
      setForm((current) => ({ ...current, image }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read that image.");
    }
  };

  const save = () => {
    const name = form.name.trim();
    const price = Number(form.sellingPrice);
    const stock = Number(form.stock);
    if (!resolvedCategory) {
      toast.error("Choose a category, or type a new one.");
      return;
    }
    if (!name) {
      toast.error("Enter the product name.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Enter a selling price greater than 0.");
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      toast.error("Stock cannot be negative.");
      return;
    }

    const payload = {
      name,
      category: resolvedCategory,
      sellingPrice: price,
      stock,
      description: form.description,
      image: form.image,
      published: form.published,
    };

    if (editing) {
      updateProduct(editing.id, payload);
      toast.success(`${name} updated. It is in POS and inventory.`);
    } else {
      addProduct(payload);
      toast.success(`${name} added. It is in POS and inventory.`);
    }
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-5 p-3 sm:p-4 lg:p-8">
      <PageHeader
        title="POP"
        subtitle="Upload a product with category, name and selling price. It is saved here, in POS and in inventory."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Upload product
          </Button>
        }
      />

      {!ready ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Upload}
          title="No products yet"
          description="Upload a chair, table, or any other piece. It will show in POS and inventory."
          action={
            <Button onClick={openCreate}>
              <Plus className="size-4" /> Upload product
            </Button>
          }
        />
      ) : (
        <div className="panel overflow-x-auto">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Selling price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-md bg-muted text-xs font-bold text-muted-foreground">
                        {product.image ? (
                          <img src={product.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          product.category.slice(0, 1)
                        )}
                      </span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatMoney(product.sellingPrice)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <StatusBadge tone={stockTone(product.stock)}>{stockLabel(product.stock)}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="outline" size="icon" aria-label={`Edit ${product.name}`} onClick={() => openEdit(product)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="outline" size="icon" aria-label={`Delete ${product.name}`} onClick={() => setToDelete(product)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "Upload product"}</DialogTitle>
            <DialogDescription>
              Choose the category, name and selling price. The product is added to POP, POS and inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="upload-category">Category</Label>
              <Select value={form.category} onValueChange={(category) => setForm({ ...form, category })}>
                <SelectTrigger id="upload-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_CATEGORY}>New category…</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.category === NEW_CATEGORY ? (
              <div className="grid gap-2">
                <Label htmlFor="upload-new-category">New category name</Label>
                <Input
                  id="upload-new-category"
                  value={form.newCategory}
                  placeholder="Lighting, Outdoor, Decor…"
                  onChange={(e) => setForm({ ...form, newCategory: e.target.value })}
                />
              </div>
            ) : null}
            <div className="grid gap-2">
              <Label htmlFor="upload-name">Product name</Label>
              <Input
                id="upload-name"
                value={form.name}
                placeholder="Oak dining chair"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="upload-price">Selling price (Rs)</Label>
                <Input
                  id="upload-price"
                  inputMode="numeric"
                  value={form.sellingPrice}
                  placeholder="8500"
                  onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="upload-stock">Stock</Label>
                <Input
                  id="upload-stock"
                  inputMode="numeric"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="upload-description">Description</Label>
              <Textarea
                id="upload-description"
                value={form.description}
                placeholder="Short note about this piece"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="upload-photo">Photo</Label>
              <div className="flex items-center gap-3">
                <div className="grid size-16 place-items-center overflow-hidden rounded-lg bg-muted">
                  {form.image ? (
                    <img src={form.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus className="size-5 text-muted-foreground" />
                  )}
                </div>
                <Input
                  id="upload-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    void onFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Save changes" : "Upload product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(next) => !next && setToDelete(null)}
        title="Remove this product?"
        description={`${toDelete?.name ?? "This product"} will leave POP, POS and inventory.`}
        confirmLabel="Remove"
        onConfirm={() => {
          if (!toDelete) return;
          deleteProduct(toDelete.id);
          toast.success(`${toDelete.name} removed`);
          setToDelete(null);
        }}
      />
    </div>
  );
}
