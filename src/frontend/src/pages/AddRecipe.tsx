import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCreateRecipe } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"];

type FieldItem = { id: string; value: string };

let counter = 0;
const newId = () => `field-${++counter}`;

export default function AddRecipe() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const createRecipe = useCreateRecipe();
  const idRef = useRef(counter);
  void idRef;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    cookTime: "",
    servings: "",
    imageUrl: "",
  });
  const [ingredients, setIngredients] = useState<FieldItem[]>([
    { id: newId(), value: "" },
  ]);
  const [instructions, setInstructions] = useState<FieldItem[]>([
    { id: newId(), value: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.category) errs.category = "Category is required";
    if (!form.cookTime || Number.isNaN(Number(form.cookTime)))
      errs.cookTime = "Valid cook time required";
    if (!form.servings || Number.isNaN(Number(form.servings)))
      errs.servings = "Valid servings required";
    if (ingredients.filter((i) => i.value.trim()).length === 0)
      errs.ingredients = "Add at least one ingredient";
    if (instructions.filter((i) => i.value.trim()).length === 0)
      errs.instructions = "Add at least one instruction";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please sign in to add a recipe");
      return;
    }
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await createRecipe.mutateAsync({
        title: form.title,
        description: form.description,
        ingredients: ingredients
          .filter((i) => i.value.trim())
          .map((i) => i.value),
        instructions: instructions
          .filter((i) => i.value.trim())
          .map((i) => i.value),
        category: form.category,
        cookTime: BigInt(form.cookTime),
        servings: BigInt(form.servings),
        imageUrl: form.imageUrl,
      });
      toast.success("Recipe created successfully!");
      navigate({ to: "/recipes" });
    } catch {
      toast.error("Failed to create recipe. Please try again.");
    }
  };

  const addIngredient = () =>
    setIngredients((prev) => [...prev, { id: newId(), value: "" }]);
  const removeIngredient = (id: string) =>
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  const updateIngredient = (id: string, val: string) =>
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: val } : item)),
    );

  const addInstruction = () =>
    setInstructions((prev) => [...prev, { id: newId(), value: "" }]);
  const removeInstruction = (id: string) =>
    setInstructions((prev) => prev.filter((item) => item.id !== id));
  const updateInstruction = (id: string, val: string) =>
    setInstructions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: val } : item)),
    );

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          Add Recipe
        </h1>
        <p className="text-muted-foreground mb-8">
          Share your culinary creation with the community
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          data-ocid="addrecipe.modal"
        >
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-display font-semibold text-lg">
              Basic Information
            </h2>

            <div className="space-y-1.5">
              <Label htmlFor="title">Recipe Title</Label>
              <Input
                id="title"
                placeholder="e.g. Grandmother's Sourdough Bread"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                data-ocid="addrecipe.title_input"
              />
              {errors.title && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="addrecipe.title_error"
                >
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your recipe..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                data-ocid="addrecipe.textarea"
              />
              {errors.description && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="addrecipe.description_error"
                >
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
                >
                  <SelectTrigger data-ocid="addrecipe.category_select">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="addrecipe.category_error"
                  >
                    {errors.category}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cookTime">Cook Time (min)</Label>
                <Input
                  id="cookTime"
                  type="number"
                  min="1"
                  placeholder="30"
                  value={form.cookTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, cookTime: e.target.value }))
                  }
                  data-ocid="addrecipe.cooktime_input"
                />
                {errors.cookTime && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="addrecipe.cooktime_error"
                  >
                    {errors.cookTime}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  placeholder="4"
                  value={form.servings}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, servings: e.target.value }))
                  }
                  data-ocid="addrecipe.servings_input"
                />
                {errors.servings && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="addrecipe.servings_error"
                  >
                    {errors.servings}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="imageUrl" className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" /> Image URL (optional)
              </Label>
              <Input
                id="imageUrl"
                placeholder="https://images.unsplash.com/..."
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                data-ocid="addrecipe.imageurl_input"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h2 className="font-display font-semibold text-lg">Ingredients</h2>
            {errors.ingredients && (
              <p
                className="text-xs text-destructive"
                data-ocid="addrecipe.ingredients_error"
              >
                {errors.ingredients}
              </p>
            )}
            {ingredients.map((ing, i) => (
              <div key={ing.id} className="flex gap-2">
                <Input
                  placeholder={`Ingredient ${i + 1}`}
                  value={ing.value}
                  onChange={(e) => updateIngredient(ing.id, e.target.value)}
                  data-ocid={`addrecipe.ingredient_input.${i + 1}`}
                />
                {ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(ing.id)}
                    className="text-destructive hover:text-destructive"
                    data-ocid={`addrecipe.ingredient_delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredient}
              className="gap-1.5"
              data-ocid="addrecipe.add_ingredient_button"
            >
              <Plus className="w-4 h-4" /> Add Ingredient
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h2 className="font-display font-semibold text-lg">Instructions</h2>
            {errors.instructions && (
              <p
                className="text-xs text-destructive"
                data-ocid="addrecipe.instructions_error"
              >
                {errors.instructions}
              </p>
            )}
            {instructions.map((step, i) => (
              <div key={step.id} className="flex gap-2 items-start">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0 mt-2">
                  {i + 1}
                </span>
                <Textarea
                  placeholder={`Step ${i + 1}`}
                  value={step.value}
                  onChange={(e) => updateInstruction(step.id, e.target.value)}
                  rows={2}
                  className="flex-1"
                  data-ocid={`addrecipe.instruction_input.${i + 1}`}
                />
                {instructions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInstruction(step.id)}
                    className="text-destructive hover:text-destructive mt-1"
                    data-ocid={`addrecipe.instruction_delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInstruction}
              className="gap-1.5"
              data-ocid="addrecipe.add_instruction_button"
            >
              <Plus className="w-4 h-4" /> Add Step
            </Button>
          </div>

          <Button
            type="submit"
            disabled={createRecipe.isPending}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base"
            data-ocid="addrecipe.submit_button"
          >
            {createRecipe.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing
                Recipe...
              </>
            ) : (
              "Publish Recipe"
            )}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
