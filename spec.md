# 3D Model Gallery - Expanded Models

## Current State
- 16 total models across 8 categories (2 per category)
- Human Anatomy only has Skeleton and Heart (no full body human with bones)
- Backend seeds models at startup; frontend fetches via actor.getAllModels()
- ModelGeometry.tsx renders each model by specific ID with switch-case

## Requested Changes (Diff)

### Add
- At least 100 models per category (800+ total visible models)
- Full human body models with visible bone skeleton overlay
- Human models: Male Body, Female Body, Child Body, Skull, Spine, Hand, Foot, Brain, Lungs, Kidneys, Muscle Anatomy, etc.
- Procedural geometry system for category-based model variations
- Frontend-side static model catalog (no longer dependent solely on backend seed for catalog)

### Modify
- Switch from backend-fetched model list to a large frontend static catalog (src/frontend/src/data/modelCatalog.ts)
- App.tsx: load models from frontend catalog, still use backend for material config persistence
- ModelGeometry.tsx: category-based procedural geometry with variant index (not per-ID switch)
- Human body model with full bone structure and bone toggle support

### Remove
- Backend seed-only model list as the sole source of truth for gallery items

## Implementation Plan
1. Create `src/frontend/src/data/modelCatalog.ts` with 100+ models per category (8 categories × 100 = 800+ entries), each with id, name, category, polygonCount, boneCount, tags, description, materialConfig
2. Update `App.tsx` to use the static catalog instead of actor.getAllModels(), keep updateMaterialConfig backend call for material persistence
3. Rewrite `ModelGeometry.tsx` to use category + variant index for procedural geometry:
   - Human Anatomy: full body human (bones toggle), skeleton, skull, heart, lungs, brain, spine, hand, foot, organs
   - Each category has 8-10 distinct geometry types cycling through 100 models
4. Add HumanBody component with articulated limbs, torso, head, and bone overlay
5. GalleryGrid: show model count per category
