import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import About from "@/pages/About";
import AddRecipe from "@/pages/AddRecipe";
import ApiDocs from "@/pages/ApiDocs";
import Architecture from "@/pages/Architecture";
import Favorites from "@/pages/Favorites";
import Health from "@/pages/Health";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import RecipeDetails from "@/pages/RecipeDetails";
import Recipes from "@/pages/Recipes";
import Register from "@/pages/Register";
import Tips from "@/pages/Tips";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const recipesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes",
  component: Recipes,
});
const recipeDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes/$id",
  component: RecipeDetails,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});
const addRecipeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add-recipe",
  component: AddRecipe,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});
const tipsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tips",
  component: Tips,
});
const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/favorites",
  component: Favorites,
});
const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: Orders,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});
const architectureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/architecture",
  component: Architecture,
});
const apiDocsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/api-docs",
  component: ApiDocs,
});
const healthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/health",
  component: Health,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  recipesRoute,
  recipeDetailsRoute,
  loginRoute,
  registerRoute,
  addRecipeRoute,
  aboutRoute,
  tipsRoute,
  favoritesRoute,
  ordersRoute,
  profileRoute,
  architectureRoute,
  apiDocsRoute,
  healthRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
