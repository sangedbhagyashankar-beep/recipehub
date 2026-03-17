import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  //--------------------- Helpers ---------------------

  func isAuthenticated(caller : Principal) : Bool {
    not caller.isAnonymous();
  };

  //--------------------- Types ---------------------

  public type UserProfile = {
    name : Text;
    email : Text;
    role : AccessControl.UserRole;
  };

  public type Recipe = {
    recipeId : Nat;
    title : Text;
    description : Text;
    ingredients : [Text];
    instructions : [Text];
    category : Text;
    cookTime : Nat;
    servings : Nat;
    imageUrl : Text;
    authorId : Principal;
    rating : Nat;
  };

  public type OrderStatus = {
    #pending;
    #confirmed;
    #preparing;
    #completed;
    #cancelled;
  };

  public type Order = {
    orderId : Nat;
    userId : Principal;
    recipeId : Nat;
    quantity : Nat;
    price : Nat;
    status : OrderStatus;
    timestamp : Nat;
  };

  public type Notification = {
    notificationId : Nat;
    userId : Principal;
    message : Text;
    isRead : Bool;
    timestamp : Nat;
  };

  //--------------------- Storage ---------------------
  let userProfiles = Map.empty<Principal, UserProfile>();
  let recipeStore = Map.empty<Nat, Recipe>();
  let orderStore = Map.empty<Nat, Order>();
  let notificationStore = Map.empty<Nat, Notification>();
  let userOrders = Map.empty<Principal, List.List<Nat>>();
  let userNotifications = Map.empty<Principal, List.List<Nat>>();

  var nextRecipeId : Nat = 0;
  var nextOrderId : Nat = 0;
  var nextNotificationId : Nat = 0;

  //--------------------- User Management ---------------------

  public shared ({ caller }) func registerUser(name : Text, email : Text, _password : Text) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in to register");
    };

    let profile : UserProfile = {
      name = name;
      email = email;
      role = #user;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not isAuthenticated(caller)) {
      return null;
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in to save profile");
    };
    userProfiles.add(caller, profile);
  };

  //--------------------- Recipe CRUD ---------------------

  public shared ({ caller }) func createRecipe(
    title : Text,
    description : Text,
    ingredients : [Text],
    instructions : [Text],
    category : Text,
    cookTime : Nat,
    servings : Nat,
    imageUrl : Text
  ) : async Nat {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in to create recipes");
    };

    let recipeId = nextRecipeId;
    nextRecipeId += 1;

    let recipe : Recipe = {
      recipeId = recipeId;
      title = title;
      description = description;
      ingredients = ingredients;
      instructions = instructions;
      category = category;
      cookTime = cookTime;
      servings = servings;
      imageUrl = imageUrl;
      authorId = caller;
      rating = 0;
    };

    recipeStore.add(recipeId, recipe);
    recipeId;
  };

  public query func getRecipe(id : Nat) : async ?Recipe {
    recipeStore.get(id);
  };

  public query func getAllRecipes() : async [Recipe] {
    recipeStore.values().toArray();
  };

  public query func getRecipesByAuthor(author : Principal) : async [Recipe] {
    let recipes = recipeStore.values().toArray();
    recipes.filter<Recipe>(func(r) { r.authorId == author });
  };

  public shared ({ caller }) func updateRecipe(
    recipeId : Nat,
    title : Text,
    description : Text,
    ingredients : [Text],
    instructions : [Text],
    category : Text,
    cookTime : Nat,
    servings : Nat,
    imageUrl : Text,
    rating : Nat
  ) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in to update recipes");
    };

    switch (recipeStore.get(recipeId)) {
      case null {
        Runtime.trap("Recipe not found");
      };
      case (?existingRecipe) {
        if (existingRecipe.authorId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the recipe author or admin can update this recipe");
        };

        let updatedRecipe : Recipe = {
          recipeId = recipeId;
          title = title;
          description = description;
          ingredients = ingredients;
          instructions = instructions;
          category = category;
          cookTime = cookTime;
          servings = servings;
          imageUrl = imageUrl;
          authorId = existingRecipe.authorId;
          rating = rating;
        };

        recipeStore.add(recipeId, updatedRecipe);
      };
    };
  };

  public shared ({ caller }) func deleteRecipe(recipeId : Nat) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in to delete recipes");
    };

    switch (recipeStore.get(recipeId)) {
      case null {
        Runtime.trap("Recipe not found");
      };
      case (?recipe) {
        if (recipe.authorId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the recipe author or admin can delete this recipe");
        };
        recipeStore.remove(recipeId);
      };
    };
  };

  //--------------------- Order Management ---------------------

  public shared ({ caller }) func placeOrder(
    recipeId : Nat,
    quantity : Nat,
    price : Nat
  ) : async Nat {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in to place orders");
    };

    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      orderId = orderId;
      userId = caller;
      recipeId = recipeId;
      quantity = quantity;
      price = price;
      status = #pending;
      timestamp = 0;
    };

    orderStore.add(orderId, order);

    let userOrderList = switch (userOrders.get(caller)) {
      case null { List.empty<Nat>() };
      case (?list) { list };
    };
    userOrderList.add(orderId);
    userOrders.add(caller, userOrderList);

    orderId;
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not isAuthenticated(caller)) {
      return [];
    };

    switch (userOrders.get(caller)) {
      case null { [] };
      case (?orderIds) {
        let orders = List.empty<Order>();
        for (orderId in orderIds.values()) {
          switch (orderStore.get(orderId)) {
            case (?order) { orders.add(order) };
            case null {};
          };
        };
        orders.values().toArray();
      };
    };
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    if (not isAuthenticated(caller)) {
      return null;
    };

    switch (orderStore.get(orderId)) {
      case null { null };
      case (?order) {
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?order;
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orderStore.get(orderId)) {
      case null {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder : Order = {
          orderId = order.orderId;
          userId = order.userId;
          recipeId = order.recipeId;
          quantity = order.quantity;
          price = order.price;
          status = status;
          timestamp = order.timestamp;
        };
        orderStore.add(orderId, updatedOrder);
      };
    };
  };

  //--------------------- Notifications ---------------------

  public shared ({ caller }) func createNotification(userId : Principal, message : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create notifications");
    };

    let notificationId = nextNotificationId;
    nextNotificationId += 1;

    let notification : Notification = {
      notificationId = notificationId;
      userId = userId;
      message = message;
      isRead = false;
      timestamp = 0;
    };

    notificationStore.add(notificationId, notification);

    let userNotifList = switch (userNotifications.get(userId)) {
      case null { List.empty<Nat>() };
      case (?list) { list };
    };
    userNotifList.add(notificationId);
    userNotifications.add(userId, userNotifList);

    notificationId;
  };

  public query ({ caller }) func getUserNotifications() : async [Notification] {
    if (not isAuthenticated(caller)) {
      return [];
    };

    switch (userNotifications.get(caller)) {
      case null { [] };
      case (?notifIds) {
        let notifications = List.empty<Notification>();
        for (notifId in notifIds.values()) {
          switch (notificationStore.get(notifId)) {
            case (?notif) { notifications.add(notif) };
            case null {};
          };
        };
        notifications.values().toArray();
      };
    };
  };

  public shared ({ caller }) func markNotificationAsRead(notificationId : Nat) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };

    switch (notificationStore.get(notificationId)) {
      case null {
        Runtime.trap("Notification not found");
      };
      case (?notification) {
        if (notification.userId != caller) {
          Runtime.trap("Unauthorized: Can only mark your own notifications as read");
        };

        let updatedNotification : Notification = {
          notificationId = notification.notificationId;
          userId = notification.userId;
          message = notification.message;
          isRead = true;
          timestamp = notification.timestamp;
        };
        notificationStore.add(notificationId, updatedNotification);
      };
    };
  };
};
