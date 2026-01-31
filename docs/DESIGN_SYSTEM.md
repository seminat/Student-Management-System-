# UI/UX Design System

## 1. Design Principles

### 1.1 Core Principles
- **Clarity**: Information should be easy to understand at a glance
- **Efficiency**: Minimize clicks and cognitive load
- **Consistency**: Maintain uniform patterns across the application
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsiveness**: Seamless experience across all devices

### 1.2 Visual Hierarchy
- Primary actions use vibrant colors
- Secondary actions use muted tones
- Tertiary actions use subtle styling
- Critical information is prominently displayed

## 2. Color System

### 2.1 Dark Theme (Primary)

**Background Colors:**
```css
--bg-primary: #0F1419;        /* Main background */
--bg-secondary: #1A1F26;      /* Card backgrounds */
--bg-tertiary: #252B35;       /* Elevated surfaces */
--bg-hover: #2D3440;          /* Hover states */
```

**Text Colors:**
```css
--text-primary: #FFFFFF;      /* Primary text */
--text-secondary: #A0A8B5;    /* Secondary text */
--text-tertiary: #6B7280;     /* Tertiary text */
--text-muted: #4B5563;        /* Muted text */
```

**Brand Colors:**
```css
--brand-primary: #3B82F6;     /* Primary blue */
--brand-secondary: #8B5CF6;   /* Purple accent */
--brand-success: #10B981;     /* Success green */
--brand-warning: #F59E0B;     /* Warning amber */
--brand-error: #EF4444;       /* Error red */
--brand-info: #06B6D4;        /* Info cyan */
```

**Accent Colors:**
```css
--accent-orange: #F97316;
--accent-pink: #EC4899;
--accent-teal: #14B8A6;
--accent-indigo: #6366F1;
```

**Chart Colors:**
```css
--chart-line: #3B82F6;
--chart-area: rgba(59, 130, 246, 0.1);
--chart-grid: #252B35;
```

### 2.2 Light Theme (Optional)

**Background Colors:**
```css
--bg-primary-light: #FFFFFF;
--bg-secondary-light: #F9FAFB;
--bg-tertiary-light: #F3F4F6;
--bg-hover-light: #E5E7EB;
```

**Text Colors:**
```css
--text-primary-light: #111827;
--text-secondary-light: #4B5563;
--text-tertiary-light: #9CA3AF;
```

## 3. Typography

### 3.1 Font Families
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 3.2 Font Sizes
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
```

### 3.3 Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 3.4 Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

## 4. Spacing System

### 4.1 Spacing Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### 4.2 Component Spacing
- **Card padding**: 24px (--space-6)
- **Section spacing**: 32px (--space-8)
- **Element gap**: 16px (--space-4)
- **Inline spacing**: 8px (--space-2)

## 5. Border Radius

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Circular */
```

## 6. Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

## 7. Component Specifications

### 7.1 Buttons

**Primary Button:**
```css
background: var(--brand-primary);
color: white;
padding: 12px 24px;
border-radius: var(--radius-lg);
font-weight: var(--font-semibold);
transition: all 0.2s ease;

&:hover {
  background: #2563EB;
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}
```

**Secondary Button:**
```css
background: var(--bg-tertiary);
color: var(--text-primary);
border: 1px solid var(--bg-hover);
```

**Sizes:**
- Small: padding 8px 16px, font-size 14px
- Medium: padding 12px 24px, font-size 16px
- Large: padding 16px 32px, font-size 18px

### 7.2 Cards

**Metric Card:**
```css
background: var(--bg-secondary);
border-radius: var(--radius-xl);
padding: var(--space-6);
border: 1px solid var(--bg-tertiary);
transition: all 0.3s ease;

&:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
  border-color: var(--brand-primary);
}
```

**Content Card:**
```css
background: var(--bg-secondary);
border-radius: var(--radius-lg);
padding: var(--space-6);
```

### 7.3 Inputs

**Text Input:**
```css
background: var(--bg-tertiary);
border: 1px solid var(--bg-hover);
border-radius: var(--radius-md);
padding: 12px 16px;
color: var(--text-primary);
font-size: var(--text-base);

&:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### 7.4 Tables

**Table Row:**
```css
border-bottom: 1px solid var(--bg-tertiary);
padding: 16px;
transition: background 0.2s ease;

&:hover {
  background: var(--bg-hover);
}
```

### 7.5 Charts

**Line Chart:**
- Line color: var(--chart-line)
- Line width: 2px
- Area fill: var(--chart-area)
- Grid color: var(--chart-grid)
- Smooth curves: true
- Animation duration: 800ms

## 8. Icons

### 8.1 Icon Library
**Primary**: Lucide React (https://lucide.dev)

**Common Icons:**
- Dashboard: LayoutDashboard
- Students: Users
- Attendance: Calendar
- Performance: TrendingUp
- Lessons: BookOpen
- Events: CalendarDays
- Notes: StickyNote
- Settings: Settings
- Logout: LogOut

### 8.2 Icon Sizes
```css
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
```

## 9. Layout

### 9.1 Sidebar
- Width: 280px (desktop)
- Background: var(--bg-secondary)
- Padding: 24px
- Fixed position

### 9.2 Main Content
- Max width: 1400px
- Padding: 32px
- Margin: 0 auto

### 9.3 Grid System
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
```

### 9.4 Responsive Breakpoints
```css
--breakpoint-sm: 640px;   /* Mobile */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large Desktop */
--breakpoint-2xl: 1536px; /* Extra Large */
```

## 10. Animations

### 10.1 Transitions
```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

### 10.2 Common Animations

**Fade In:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Slide Up:**
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Scale In:**
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 10.3 Hover Effects
- Cards: translateY(-2px) + shadow
- Buttons: translateY(-1px) + shadow
- Links: color change
- Icons: scale(1.1)

## 11. Accessibility

### 11.1 Focus States
```css
*:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}
```

### 11.2 Color Contrast
- Text on background: minimum 4.5:1
- Large text: minimum 3:1
- Interactive elements: minimum 3:1

### 11.3 Keyboard Navigation
- Tab order follows visual flow
- All interactive elements are keyboard accessible
- Skip to main content link
- Escape key closes modals

### 11.4 Screen Reader Support
- Semantic HTML elements
- ARIA labels for icons
- ARIA live regions for dynamic content
- Alt text for images

## 12. Component Library

### 12.1 Atomic Components

**Button.tsx**
- Variants: primary, secondary, outline, ghost
- Sizes: sm, md, lg
- States: default, hover, active, disabled

**Input.tsx**
- Types: text, email, password, number
- States: default, focus, error, disabled
- With label and error message

**Card.tsx**
- Variants: default, elevated, bordered
- With header, body, footer sections

**Badge.tsx**
- Variants: success, warning, error, info
- Sizes: sm, md, lg

### 12.2 Composite Components

**MetricCard.tsx**
- Icon
- Value (large number)
- Label
- Trend indicator (optional)

**PerformanceTable.tsx**
- Student avatar
- Name
- Class
- Mastery percentage
- Filters (grade, class, mastery)

**AttendanceChart.tsx**
- Line chart
- Time period selector
- Statistics summary

**LessonItem.tsx**
- Time
- Subject
- Type
- Duration
- Reminder button

## 13. Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --bg-primary: #0F1419;
  --bg-secondary: #1A1F26;
  --bg-tertiary: #252B35;
  --bg-hover: #2D3440;
  
  --text-primary: #FFFFFF;
  --text-secondary: #A0A8B5;
  --text-tertiary: #6B7280;
  
  --brand-primary: #3B82F6;
  --brand-success: #10B981;
  --brand-warning: #F59E0B;
  --brand-error: #EF4444;
  
  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --text-base: 1rem;
  --font-medium: 500;
  
  /* Spacing */
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Border Radius */
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Shadows */
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-base: 200ms ease;
}
```

## 14. Figma Design File Structure

```
Student Management Dashboard
├── 📁 Design System
│   ├── Colors
│   ├── Typography
│   ├── Components
│   └── Icons
├── 📁 Pages
│   ├── Login
│   ├── Dashboard
│   ├── Students
│   ├── Attendance
│   ├── Lessons
│   └── Events
├── 📁 Components
│   ├── Buttons
│   ├── Cards
│   ├── Forms
│   ├── Tables
│   └── Charts
└── 📁 Prototypes
    ├── Desktop Flow
    ├── Tablet Flow
    └── Mobile Flow
```

## 15. Implementation Guidelines

### 15.1 CSS Organization
```
styles/
├── globals.css          # Global styles and CSS variables
├── reset.css            # CSS reset
├── utilities.css        # Utility classes
└── components/          # Component-specific styles
```

### 15.2 TailwindCSS Configuration
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0F1419',
          secondary: '#1A1F26',
          tertiary: '#252B35',
        },
        brand: {
          primary: '#3B82F6',
          success: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

### 15.3 Component Development
1. Start with design tokens
2. Build atomic components
3. Compose into molecules
4. Create page layouts
5. Add interactions
6. Test accessibility
