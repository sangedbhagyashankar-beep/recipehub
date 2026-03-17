import { useActor } from "@/hooks/useActor";
import type { Notification, Order, Recipe, UserProfile } from "../backend";

// Re-export types for convenience
export type { Recipe, Order, UserProfile, Notification };

// Sample recipes for fallback when backend is empty
export const SAMPLE_RECIPES: Recipe[] = [
  {
    recipeId: BigInt(1),
    title: "Spaghetti Carbonara",
    description:
      "A classic Italian pasta dish made with eggs, Pecorino Romano, guanciale, and black pepper. Rich, creamy and utterly satisfying.",
    category: "Dinner",
    cookTime: BigInt(30),
    servings: BigInt(4),
    rating: BigInt(5),
    imageUrl:
      "https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?w=600&auto=format&fit=crop",
    ingredients: [
      "400g spaghetti",
      "200g guanciale",
      "4 egg yolks",
      "100g Pecorino Romano",
      "Black pepper",
    ],
    instructions: [
      "Cook pasta in salted water",
      "Fry guanciale until crispy",
      "Mix eggs with cheese",
      "Combine all with pasta water",
    ],
    authorId: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    recipeId: BigInt(2),
    title: "Chicken Tikka Masala",
    description:
      "Tender chicken marinated in spices and yogurt, cooked in a rich, creamy tomato-based sauce. A beloved British-Indian classic.",
    category: "Dinner",
    cookTime: BigInt(45),
    servings: BigInt(6),
    rating: BigInt(5),
    imageUrl:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop",
    ingredients: [
      "800g chicken breast",
      "400ml coconut cream",
      "400g canned tomatoes",
      "Tikka masala paste",
      "Greek yogurt",
    ],
    instructions: [
      "Marinate chicken in yogurt and spices",
      "Grill chicken until charred",
      "Make the masala sauce",
      "Simmer chicken in sauce",
    ],
    authorId: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    recipeId: BigInt(3),
    title: "Avocado Toast Deluxe",
    description:
      "Elevated avocado toast with poached eggs, microgreens, and a drizzle of chili oil. The ultimate brunch experience.",
    category: "Breakfast",
    cookTime: BigInt(15),
    servings: BigInt(2),
    rating: BigInt(4),
    imageUrl:
      "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600&auto=format&fit=crop",
    ingredients: [
      "2 ripe avocados",
      "4 slices sourdough",
      "2 eggs",
      "Microgreens",
      "Chili flakes",
      "Lemon juice",
    ],
    instructions: [
      "Toast sourdough",
      "Mash avocado with lemon",
      "Poach eggs",
      "Assemble with toppings",
    ],
    authorId: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    recipeId: BigInt(4),
    title: "Chocolate Lava Cake",
    description:
      "Decadent individual chocolate cakes with a warm, gooey molten center. Serve with vanilla ice cream for the ultimate dessert.",
    category: "Dessert",
    cookTime: BigInt(25),
    servings: BigInt(4),
    rating: BigInt(5),
    imageUrl:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&auto=format&fit=crop",
    ingredients: [
      "200g dark chocolate",
      "100g butter",
      "4 eggs",
      "100g sugar",
      "60g flour",
    ],
    instructions: [
      "Melt chocolate and butter",
      "Whisk eggs with sugar",
      "Fold in flour",
      "Bake 12 minutes at 200°C",
    ],
    authorId: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    recipeId: BigInt(5),
    title: "Classic Greek Salad",
    description:
      "A refreshing Mediterranean salad with crisp cucumbers, juicy tomatoes, Kalamata olives, and creamy feta cheese.",
    category: "Lunch",
    cookTime: BigInt(10),
    servings: BigInt(4),
    rating: BigInt(4),
    imageUrl:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop",
    ingredients: [
      "3 large tomatoes",
      "1 cucumber",
      "200g feta cheese",
      "Kalamata olives",
      "Red onion",
      "Olive oil",
      "Oregano",
    ],
    instructions: [
      "Chop vegetables roughly",
      "Add olives and feta",
      "Drizzle with olive oil",
      "Season with oregano and salt",
    ],
    authorId: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    recipeId: BigInt(6),
    title: "Street-Style Beef Tacos",
    description:
      "Authentic Mexican street tacos with seasoned ground beef, fresh pico de gallo, and cotija cheese on warm corn tortillas.",
    category: "Dinner",
    cookTime: BigInt(20),
    servings: BigInt(4),
    rating: BigInt(5),
    imageUrl:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop",
    ingredients: [
      "500g ground beef",
      "8 corn tortillas",
      "Pico de gallo",
      "Cotija cheese",
      "Lime",
      "Cilantro",
      "Taco seasoning",
    ],
    instructions: [
      "Season and brown beef",
      "Warm tortillas",
      "Make fresh pico de gallo",
      "Assemble tacos with toppings",
    ],
    authorId: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
];

// This hook-based service provides API methods via the actor
export function useApiService() {
  const { actor } = useActor();

  return {
    actor,
    async getAllRecipes(): Promise<Recipe[]> {
      if (!actor) return SAMPLE_RECIPES;
      const recipes = await actor.getAllRecipes();
      return recipes.length > 0 ? recipes : SAMPLE_RECIPES;
    },
    async getRecipe(id: bigint): Promise<Recipe | null> {
      if (!actor) return SAMPLE_RECIPES.find((r) => r.recipeId === id) ?? null;
      return actor.getRecipe(id);
    },
    async createRecipe(
      title: string,
      description: string,
      ingredients: string[],
      instructions: string[],
      category: string,
      cookTime: bigint,
      servings: bigint,
      imageUrl: string,
    ): Promise<bigint> {
      if (!actor) throw new Error("Not authenticated");
      return actor.createRecipe(
        title,
        description,
        ingredients,
        instructions,
        category,
        cookTime,
        servings,
        imageUrl,
      );
    },
    async placeOrder(
      recipeId: bigint,
      quantity: bigint,
      price: bigint,
    ): Promise<bigint> {
      if (!actor) throw new Error("Not authenticated");
      return actor.placeOrder(recipeId, quantity, price);
    },
    async getUserOrders(): Promise<Order[]> {
      if (!actor) return [];
      return actor.getUserOrders();
    },
    async getUserNotifications(): Promise<Notification[]> {
      if (!actor) return [];
      return actor.getUserNotifications();
    },
    async markNotificationAsRead(id: bigint): Promise<void> {
      if (!actor) return;
      return actor.markNotificationAsRead(id);
    },
    async registerUser(
      name: string,
      email: string,
      password: string,
    ): Promise<void> {
      if (!actor) throw new Error("Not authenticated");
      return actor.registerUser(name, email, password);
    },
    async getCallerUserProfile(): Promise<UserProfile | null> {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
  };
}
