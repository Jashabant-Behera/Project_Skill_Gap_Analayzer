# Dark Theme Design System for Skill Assessment Platform

## Overview

This dark theme design system transforms your Skill Assessment Platform with a modern, high-contrast aesthetic featuring:

- **Sophisticated Dark Palette**: Deep blues and blacks with cyan and purple accents
- **Animated Components**: Smooth transitions, hover effects, and micro-interactions
- **Glass Morphism**: Subtle backdrop blur effects for depth
- **Gradient Accents**: Eye-catching cyan-to-purple gradients
- **Custom Typography**: Syne for headings, Space Mono for code

## Color Palette

### Background Colors
```css
--bg-primary: #0a0e1a       /* Main dark background */
--bg-secondary: #131825     /* Card backgrounds */
--bg-tertiary: #1a2030      /* Elevated elements */
--bg-elevated: #232b3d      /* Hover states */
```

### Accent Colors
```css
--accent-primary: #00f5ff    /* Cyan - Primary actions */
--accent-secondary: #7c3aed  /* Purple - Secondary emphasis */
```

### Text Colors
```css
--text-primary: #f8fafc      /* Headings, important text */
--text-secondary: #cbd5e1    /* Body text */
--text-tertiary: #94a3b8     /* Less important text */
--text-muted: #64748b        /* Placeholder, disabled */
```

### Status Colors
```css
--success: #10b981           /* Green for success states */
--warning: #f59e0b           /* Amber for warnings */
--error: #ef4444             /* Red for errors */
--info: #06b6d4              /* Cyan for info */
```

## Typography

### Font Families
- **Headings**: `'Syne', sans-serif` - Modern, bold, distinctive
- **Body**: `'Inter', sans-serif` - Clean, readable
- **Code**: `'Space Mono', monospace` - Technical, retro-futuristic

### Usage
```jsx
<h1>Automatically uses Syne, large and bold</h1>
<p>Body text uses Inter</p>
<code>Code uses Space Mono</code>
```

## Component Classes

### Buttons

#### Primary Button
```jsx
<button className="btn-primary">
  Get Started
</button>
```
- Gradient background (cyan to purple)
- Hover lift effect
- Glow shadow
- White overlay on hover

#### Secondary Button
```jsx
<button className="btn-secondary">
  Learn More
</button>
```
- Dark elevated background
- Border on hover turns cyan
- Subtle lift effect

#### Outline Button
```jsx
<button className="btn-outline">
  Sign In
</button>
```
- Transparent with cyan border
- Fill animation on hover
- Color inverts on hover

### Cards

#### Standard Card
```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```
- Dark background with subtle border
- Top border glow on hover
- Padding and rounded corners

#### Hover Card
```jsx
<div className="card-hover">
  <h3>Interactive Card</h3>
  <p>Clickable content...</p>
</div>
```
- All card features plus:
- Lifts on hover (-4px translateY)
- Gradient border reveal
- Enhanced shadow with glow

### Input Fields

```jsx
<input 
  className="input-field" 
  placeholder="Enter text..."
/>
```
- Dark background
- Cyan border on focus
- Glow effect when active
- Smooth transitions

### Badges

```jsx
<span className="badge badge-primary">New</span>
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Failed</span>
```

### Progress Bars

```jsx
<div className="progress-bar">
  <div className="progress-bar-fill" style={{ width: '75%' }} />
</div>
```
- Gradient fill with shimmer animation
- Smooth width transitions

## Utility Classes

### Gradient Text
```jsx
<span className="gradient-text">Highlighted Text</span>
```
Creates cyan-to-purple gradient text effect

### Glass Effect
```jsx
<div className="glass">
  Semi-transparent blurred background
</div>
```

### Animations
```jsx
<div className="animate-fadeIn">Fades in from bottom</div>
<div className="animate-slideIn">Slides in from left</div>
<div className="animate-pulse-glow">Pulsing glow effect</div>
```

### Hover Glow
```jsx
<div className="hover-glow">
  Glows with cyan shadow on hover
</div>
```

## Background Effects

### Global Grid Pattern
The body has an animated grid pattern overlay for visual interest.

### Gradient Orbs
Radial gradients create ambient light effects:
```css
radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)
```

## Shadows

```css
--shadow-sm: Subtle depth
--shadow-md: Card elevation
--shadow-lg: Modal/dropdown
--shadow-xl: Maximum elevation
--shadow-glow: Cyan glow effect
--shadow-glow-strong: Intense glow
```

## Custom Scrollbar

- Gradient thumb (cyan to purple)
- Dark track
- Smooth hover transitions

## Responsive Behavior

All components are mobile-responsive:
- Typography scales with `clamp()`
- Grids collapse to single column
- Navigation transforms to mobile menu
- Touch-friendly tap targets (44px minimum)

## Animation Timing

```css
cubic-bezier(0.4, 0, 0.2, 1)  /* Smooth ease-out for most transitions */
```

## Implementation Guide

### 1. Replace CSS File
Replace `frontend/src/styles/index.css` with `dark-theme.css`

### 2. Update Components
Use the provided dark theme components:
- `LandingPage-dark.jsx` → `LandingPage.jsx`
- `Navbar-dark.jsx` → `Navbar.jsx`

### 3. Apply to Existing Components
Update your existing components to use the new classes:

**Before:**
```jsx
<div className="bg-white rounded-lg shadow-sm p-6">
```

**After:**
```jsx
<div className="card">
```

### 4. Color References
Use CSS variables for custom styling:
```jsx
<div style={{ 
  background: 'var(--bg-secondary)',
  borderColor: 'var(--accent-primary)'
}}>
```

## Best Practices

1. **Contrast**: Ensure text meets WCAG AA standards (4.5:1 for body, 3:1 for large)
2. **Consistency**: Use predefined colors and components
3. **Animations**: Keep under 0.3s for micro-interactions, 0.6s for page transitions
4. **Accessibility**: 
   - Maintain focus states
   - Use semantic HTML
   - Provide alt text
   - Test with screen readers

## Example Component

```jsx
import React from 'react';
import { Star, ArrowRight } from 'lucide-react';

export const FeatureCard = ({ title, description, icon: Icon }) => {
  return (
    <div className="card-hover">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      
      <p className="text-[var(--text-secondary)] mb-4">
        {description}
      </p>
      
      <div className="flex items-center gap-2 text-[var(--accent-primary)] font-medium">
        <span>Learn more</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
};
```

## Tailwind Configuration

Add these colors to `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#00f5ff',
          700: '#00d4e6',
        },
        dark: {
          bg: {
            primary: '#0a0e1a',
            secondary: '#131825',
            tertiary: '#1a2030',
          }
        }
      }
    }
  }
}
```

## Additional Features to Implement

1. **Loading States**: Skeleton screens with shimmer effects
2. **Toasts**: Slide-in notifications with auto-dismiss
3. **Modals**: Backdrop blur with scale animations
4. **Tooltips**: Smooth fade with positioning
5. **Dropdown Menus**: Slide-down with shadow
6. **Charts**: Dark theme compatible with glow effects

## Resources

- Google Fonts: Syne, Space Mono
- Icons: Lucide React
- Animation Library: Framer Motion (optional enhancement)
- Recharts: For dark theme compatible charts

## Support

For issues or questions about the dark theme:
1. Check CSS variable values
2. Verify component class names
3. Test browser compatibility
4. Review animation performance

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**License**: MIT
