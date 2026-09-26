# LevelUp Landing Page - TODO

## 1. Design & Graphics Definition ("Alpine Dusk")
- [ ] **Colors**: 
  - Background: `#0D1117`
  - Surface: `#161B22`
  - Primary (CTA): `#4397B8`
  - Accent: `#E5A970`
  - Text Primary: `#FFFFFF`
  - Text Secondary: `#8B949E`
- [ ] **Typography**: 
  - `Outfit` font (via Google Fonts).
  - Use `Outfit` for both headers and body for a consistent, clean, and modern look.
- [ ] **Layout (Vanilla HTML/CSS + Bootstrap utilities if needed)**:
  - Header with app name/logo.
  - Hero Section: Left-aligned content / right-aligned asset (variance 7). Large headline, concise subtext.
  - Features Section: 3-column minimalist layout for Macro-Planning, Time-Blocking, Local-First.
  - Footer: Utilizing the global `Script/footer.js` as per the repository rules.

## 2. File Structure Updates
- [ ] `projects/LevelUp/index.html`: Main landing page.
- [ ] `projects/LevelUp/privacy-policy.html`: Privacy policy required by Google Play Console.
- [ ] `Style/levelup.css`: Specific styles for the LevelUp project, defining the "Alpine Dusk" theme.
- [ ] Copy or reference assets (Icon, Feature Graphic) from `/home/gizano/Projects/LevelUp/release/` into `assets/levelup/`.

## 3. Implementation Steps
- [x] **Step 1: Setup Assets & CSS**
  - Create directory `assets/levelup/` and copy images.
  - Create `Style/levelup.css` and inject CSS variables for the Alpine Dusk palette.
  - Import the `Outfit` font.
- [x] **Step 2: Build `privacy-policy.html`**
  - Simple, readable layout.
  - Apply centralized footer (`Script/footer.js`).
- [x] **Step 3: Build `index.html` (Landing Page)**
  - **Hero**: "Gamify your goals. Conquer your peaks."
  - CTA 1: Download on Google Play (use styled button).
  - CTA 2: Source on GitHub.
  - **Features**: Implement the 3 key features.
  - **Footer**: Include centralized footer.
- [x] **Step 4: Refinement**
  - Check contrast ratios (especially on `#4397B8` CTAs with `#FFFFFF` text).
  - Ensure mobile responsiveness without layout jumps.
