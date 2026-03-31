import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  type Model = {
    id : Text;
    name : Text;
    category : Text;
    polygonCount : Nat;
    textureInfo : Text;
    boneCount : Nat;
    tags : [Text];
    createdAt : Int;
    materialConfig : Text; // JSON string
    description : Text;
  };

  module Model {
    public func compare(model1 : Model, model2 : Model) : Order.Order {
      Text.compare(model1.name, model2.name);
    };
    public func compareById(model1 : Model, model2 : Model) : Order.Order {
      Text.compare(model1.id, model2.id);
    };
    public func compareByCategory(model1 : Model, model2 : Model) : Order.Order {
      Text.compare(model1.category, model2.category);
    };
  };

  let models = Map.empty<Text, Model>();

  public type ModelInput = {
    id : Text;
    name : Text;
    category : Text;
    polygonCount : Nat;
    textureInfo : Text;
    boneCount : Nat;
    tags : [Text];
    materialConfig : Text;
    description : Text;
  };

  public shared ({ caller }) func saveModel(modelInput : ModelInput) : async () {
    if (models.containsKey(modelInput.id)) {
      Runtime.trap("Model with this ID already exists");
    };
    let model : Model = {
      modelInput with
      createdAt = Time.now();
    };
    models.add(modelInput.id, model);
  };

  public query ({ caller }) func getModel(id : Text) : async Model {
    switch (models.get(id)) {
      case (null) { Runtime.trap("Model not found") };
      case (?model) { model };
    };
  };

  public query ({ caller }) func getAllModels() : async [Model] {
    models.values().toArray().sort();
  };

  public query ({ caller }) func filterModelsByName(name : Text) : async [Model] {
    models.values().toArray().filter(
      func(model) {
        model.name.toLower().contains(#text(name.toLower()));
      }
    );
  };

  public query ({ caller }) func listByCategory(category : Text) : async [Model] {
    models.values().toArray().filter(
      func(m) {
        m.category.toLower().contains(#text(category.toLower()));
      }
    );
  };

  public query ({ caller }) func searchModels(searchTerm : Text) : async [Model] {
    models.values().toArray().filter(
      func(m) {
        m.name.toLower().contains(#text(searchTerm.toLower())) or
        m.tags.find(func(t) { t.toLower().contains(#text(searchTerm.toLower())) }) != null;
      }
    );
  };

  public shared ({ caller }) func deleteModel(id : Text) : async () {
    if (not models.containsKey(id)) { Runtime.trap("Model does not exist") };
    models.remove(id);
  };

  public query ({ caller }) func getCategories() : async [(Text, Nat)] {
    let categoryCount = Map.empty<Text, Nat>();

    for (model in models.values()) {
      let category = model.category;
      switch (categoryCount.get(category)) {
        case (?count) { categoryCount.add(category, count + 1) };
        case (null) { categoryCount.add(category, 1) };
      };
    };

    categoryCount.entries().toArray().sort(
      func((catA, _), (catB, _)) { Text.compare(catA, catB) }
    );
  };

  public shared ({ caller }) func updateMaterialConfig(id : Text, newConfig : Text) : async () {
    switch (models.get(id)) {
      case (null) { Runtime.trap("Model not found") };
      case (?model) {
        let updated : Model = {
          model with
          materialConfig = newConfig;
        };
        models.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getModelCount() : async Nat {
    models.size();
  };

  // Initialize with sample data
  let sampleModels : [Model] = [
    // Human Anatomy
    {
      id = "anatomy_1";
      name = "Human Skeleton";
      category = "Human Anatomy";
      polygonCount = 10000;
      textureInfo = "Diffuse, normal maps";
      boneCount = 206;
      tags = ["skeleton", "bones", "anatomy"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#fffbe6\", \"roughness\": 0.8, \"metalness\": 0.2}";
      description = "Detailed model of a human skeleton.";
    },
    {
      id = "anatomy_2";
      name = "Human Heart";
      category = "Human Anatomy";
      polygonCount = 5500;
      textureInfo = "High-res texture";
      boneCount = 0;
      tags = ["heart", "organ", "anatomy"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#c1440e\", \"roughness\": 0.5, \"metalness\": 0.1}";
      description = "Realistic human heart model.";
    },
    // Architecture
    {
      id = "house_1";
      name = "Modern House";
      category = "Architecture";
      polygonCount = 25000;
      textureInfo = "PBR materials";
      boneCount = 0;
      tags = ["house", "building", "architecture"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#dddddd\", \"roughness\": 0.4, \"metalness\": 0.3}";
      description = "Contemporary 3-bedroom house.";
    },
    {
      id = "castle_1";
      name = "Medieval Castle";
      category = "Architecture";
      polygonCount = 40000;
      textureInfo = "Stone, wood textures";
      boneCount = 0;
      tags = ["castle", "fortress", "medieval"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#b1a580\", \"roughness\": 0.7, \"metalness\": 0.1}";
      description = "Large medieval castle model.";
    },
    // Vehicles
    {
      id = "car_1";
      name = "Sports Car";
      category = "Vehicles";
      polygonCount = 8000;
      textureInfo = "Car paint, glass materials";
      boneCount = 0;
      tags = ["car", "vehicle", "transport"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#ff0000\", \"roughness\": 0.3, \"metalness\": 0.8}";
      description = "High-poly sports car model.";
    },
    {
      id = "motorbike_1";
      name = "Motorbike";
      category = "Vehicles";
      polygonCount = 6000;
      textureInfo = "Metal, rubber textures";
      boneCount = 0;
      tags = ["motorbike", "bike", "vehicle"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#222222\", \"roughness\": 0.5, \"metalness\": 0.7}";
      description = "Detailed motorbike 3D model.";
    },
    // Furniture
    {
      id = "sofa_1";
      name = "Leather Sofa";
      category = "Furniture";
      polygonCount = 4000;
      textureInfo = "Leather texture";
      boneCount = 0;
      tags = ["sofa", "couch", "furniture"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#836953\", \"roughness\": 0.6, \"metalness\": 0.2}";
      description = "Realistic leather sofa model.";
    },
    {
      id = "table_1";
      name = "Office Desk";
      category = "Furniture";
      polygonCount = 3000;
      textureInfo = "Wood grain texture";
      boneCount = 0;
      tags = ["desk", "table", "furniture"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#deb887\", \"roughness\": 0.5, \"metalness\": 0.1}";
      description = "Modern office desk model.";
    },
    // Electronics
    {
      id = "tv_1";
      name = "Smart TV";
      category = "Electronics";
      polygonCount = 1500;
      textureInfo = "Glossy screen, plastic";
      boneCount = 0;
      tags = ["tv", "electronics", "appliance"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#1c1c1c\", \"roughness\": 0.2, \"metalness\": 0.7}";
      description = "3D model of a smart TV.";
    },
    {
      id = "laptop_1";
      name = "Laptop";
      category = "Electronics";
      polygonCount = 2200;
      textureInfo = "Metal, plastic materials";
      boneCount = 0;
      tags = ["laptop", "computer", "electronics"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#cccccc\", \"roughness\": 0.4, \"metalness\": 0.5}";
      description = "Detailed laptop 3D model.";
    },
    // Food
    {
      id = "burger_1";
      name = "Hamburger";
      category = "Food";
      polygonCount = 1800;
      textureInfo = "Realistic food textures";
      boneCount = 0;
      tags = ["burger", "food", "fast food"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#e4bb7d\", \"roughness\": 0.8, \"metalness\": 0.1}";
      description = "Delicious hamburger model.";
    },
    {
      id = "pizza_1";
      name = "Pizza Slice";
      category = "Food";
      polygonCount = 1200;
      textureInfo = "Cheese, tomato materials";
      boneCount = 0;
      tags = ["pizza", "food", "italian"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#f5d376\", \"roughness\": 0.7, \"metalness\": 0.1}";
      description = "3D model of a pizza slice.";
    },
    // Sports
    {
      id = "soccer_ball";
      name = "Soccer Ball";
      category = "Sports";
      polygonCount = 900;
      textureInfo = "Leather texture";
      boneCount = 0;
      tags = ["soccer", "ball", "sports"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#ffffff\", \"roughness\": 0.5, \"metalness\": 0.2}";
      description = "Realistic soccer ball model.";
    },
    {
      id = "tennis_racket";
      name = "Tennis Racket";
      category = "Sports";
      polygonCount = 1400;
      textureInfo = "Grip, string materials";
      boneCount = 0;
      tags = ["tennis", "racket", "sports"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#222222\", \"roughness\": 0.6, \"metalness\": 0.3}";
      description = "Detailed tennis racket model.";
    },
    // Weapons
    {
      id = "sword_1";
      name = "Longsword";
      category = "Weapons";
      polygonCount = 1800;
      textureInfo = "Metal, leather materials";
      boneCount = 0;
      tags = ["sword", "weapon", "medieval"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#b7b7b7\", \"roughness\": 0.4, \"metalness\": 0.9}";
      description = "3D model of a longsword.";
    },
    {
      id = "gun_1";
      name = "Pistol";
      category = "Weapons";
      polygonCount = 2000;
      textureInfo = "Gunmetal, plastic";
      boneCount = 0;
      tags = ["pistol", "gun", "weapon"];
      createdAt = 0;
      materialConfig = "{\"color\": \"#2c2c2c\", \"roughness\": 0.3, \"metalness\": 0.8}";
      description = "Realistic pistol 3D model.";
    },
  ];

  for (model in sampleModels.values()) {
    models.add(model.id, model);
  };

  include MixinStorage();
};
