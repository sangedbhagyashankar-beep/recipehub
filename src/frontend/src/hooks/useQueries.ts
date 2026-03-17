import { SAMPLE_RECIPES } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Notification, Order, Recipe, UserProfile } from "../backend";
import { useActor } from "./useActor";

export function useAllRecipes() {
  const { actor, isFetching } = useActor();
  return useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: async () => {
      if (!actor) return SAMPLE_RECIPES;
      const recipes = await actor.getAllRecipes();
      return recipes.length > 0 ? recipes : SAMPLE_RECIPES;
    },
    enabled: !isFetching,
    placeholderData: SAMPLE_RECIPES,
  });
}

export function useRecipe(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Recipe | null>({
    queryKey: ["recipe", id?.toString()],
    queryFn: async () => {
      if (!id) return null;
      if (!actor) return SAMPLE_RECIPES.find((r) => r.recipeId === id) ?? null;
      return actor.getRecipe(id);
    },
    enabled: !!id && !isFetching,
  });
}

export function useUserNotifications() {
  const { actor, isFetching } = useActor();
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useUserOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRecipe() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      ingredients: string[];
      instructions: string[];
      category: string;
      cookTime: bigint;
      servings: bigint;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createRecipe(
        data.title,
        data.description,
        data.ingredients,
        data.instructions,
        data.category,
        data.cookTime,
        data.servings,
        data.imageUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      recipeId: bigint;
      quantity: bigint;
      price: bigint;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.placeOrder(data.recipeId, data.quantity, data.price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useMarkNotificationRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: bigint) => {
      if (!actor) return;
      return actor.markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
