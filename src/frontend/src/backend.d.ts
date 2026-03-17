import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Recipe {
    title: string;
    recipeId: bigint;
    authorId: Principal;
    cookTime: bigint;
    description: string;
    instructions: Array<string>;
    imageUrl: string;
    category: string;
    rating: bigint;
    servings: bigint;
    ingredients: Array<string>;
}
export interface Order {
    status: OrderStatus;
    recipeId: bigint;
    userId: Principal;
    orderId: bigint;
    timestamp: bigint;
    quantity: bigint;
    price: bigint;
}
export interface UserProfile {
    name: string;
    role: UserRole;
    email: string;
}
export interface Notification {
    userId: Principal;
    isRead: boolean;
    message: string;
    timestamp: bigint;
    notificationId: bigint;
}
export enum OrderStatus {
    preparing = "preparing",
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNotification(userId: Principal, message: string): Promise<bigint>;
    createRecipe(title: string, description: string, ingredients: Array<string>, instructions: Array<string>, category: string, cookTime: bigint, servings: bigint, imageUrl: string): Promise<bigint>;
    deleteRecipe(recipeId: bigint): Promise<void>;
    getAllRecipes(): Promise<Array<Recipe>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getRecipe(id: bigint): Promise<Recipe | null>;
    getRecipesByAuthor(author: Principal): Promise<Array<Recipe>>;
    getUserNotifications(): Promise<Array<Notification>>;
    getUserOrders(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markNotificationAsRead(notificationId: bigint): Promise<void>;
    placeOrder(recipeId: bigint, quantity: bigint, price: bigint): Promise<bigint>;
    registerUser(name: string, email: string, password: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateRecipe(recipeId: bigint, title: string, description: string, ingredients: Array<string>, instructions: Array<string>, category: string, cookTime: bigint, servings: bigint, imageUrl: string, rating: bigint): Promise<void>;
}
