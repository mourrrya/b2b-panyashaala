# Slate Masking Design System

> Professional, elegant masking effects with gradient overlays for a cohesive slate-themed UI

## Overview

This design system provides a collection of reusable masking and glass-morphism effects built with Tailwind CSS v4. The slate color palette creates a sophisticated, modern aesthetic suitable for professional B2B applications.

---

## 🎨 Color Palette

### Primary Slate Tones

| Token       | Value     | Usage                                 |
| ----------- | --------- | ------------------------------------- |
| `slate-50`  | `#f8fafc` | Lightest backgrounds, subtle fills    |
| `slate-100` | `#f1f5f9` | Light backgrounds, secondary surfaces |
| `slate-200` | `#e2e8f0` | Borders, dividers, subtle accents     |
| `slate-300` | `#cbd5e1` | Disabled states, muted elements       |
| `slate-400` | `#94a3b8` | Placeholder text, secondary icons     |
| `slate-500` | `#64748b` | Secondary text, icon fills            |
| `slate-600` | `#475569` | Primary icons, emphasized text        |
| `slate-700` | `#334155` | Strong emphasis, dark accents         |
| `slate-800` | `#1e293b` | Primary text, headings                |
| `slate-900` | `#0f172a` | Maximum contrast text                 |

### Opacity Variants

```css
/* Recommended opacity levels for layered effects */
from-slate-100/80    /* 80% - Primary mask layer */
via-slate-50/60      /* 60% - Mid-layer transitions */
to-white/40          /* 40% - Light fade */
from-slate-200/30    /* 30% - Subtle overlays */
to-slate-100/20      /* 20% - Gentle accents */
```

---

## 🎭 Masking Components

### 1. Slate Mask Overlay

A subtle layered gradient overlay that creates depth and visual hierarchy.

```tsx
function SlateMaskOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Primary gradient mask layer */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-100/80 via-slate-50/60 to-white/40 pointer-events-none z-0" />
      {/* Subtle radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_top_right] from-slate-200/30 via-transparent to-slate-100/20 pointer-events-none z-0" />
      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

**When to use:**

- Wrapping content that needs visual separation from background
- Creating subtle layered effects
- Adding depth to flat surfaces

---

### 2. Slate Glass Card

A professional glass-morphism effect with layered gradients and subtle shadows.

```tsx
function SlateGlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl
        bg-linear-to-br from-white/90 via-slate-50/80 to-slate-100/70
        backdrop-blur-sm
        border border-slate-200/60
        shadow-[0_4px_24px_-4px_rgba(51,65,85,0.12)]
        before:absolute before:inset-0 
        before:bg-linear-to-tr before:from-slate-200/20 before:via-transparent before:to-white/30
        before:pointer-events-none
        ${className}
      `}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

**When to use:**

- Info cards and callouts
- Elevated content sections
- Modal overlays
- Tooltip containers

---

### 3. Address/Content Cards with Hover Effects

Interactive cards with elegant transitions and depth layers. **Hover effects should only be applied to clickable/interactive elements** to maintain proper user experience expectations.

```tsx
<div
  className={`
    relative flex-1 p-4 min-w-52 rounded-xl overflow-hidden
    bg-linear-to-br from-white/90 via-slate-50/80 to-slate-100/70
    border border-slate-200/60
    backdrop-blur-sm
    shadow-[0_2px_12px_-3px_rgba(51,65,85,0.08)]
    transition-all duration-300 ease-out
    hover:shadow-[0_8px_24px_-6px_rgba(51,65,85,0.15)]
    hover:-translate-y-0.5
    before:absolute before:inset-0 
    before:bg-linear-to-tr before:from-slate-200/10 before:via-transparent before:to-white/20
    before:pointer-events-none
  `}
>
  {/* Top edge highlight for depth */}
  <div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />

  <div className="relative z-10">{/* Content */}</div>
</div>
```

**Hover Guidelines:**

- ✅ **Apply to**: Buttons, links, interactive cards, form inputs
- ✅ **Apply to**: Stats cards with future navigation (like Orders card in ProfileHeader)
- ❌ **Avoid on**: Static content, informational displays, non-interactive elements
- 🎯 **Purpose**: Indicate clickability and provide visual feedback

---

## 🏷️ Badge Styles

### Default Badge (Slate Gradient)

```tsx
<span className="inline-flex items-center gap-1 px-2.5 py-1 bg-linear-to-r from-slate-600 to-slate-700 text-white text-xs font-semibold rounded-full shadow-sm">
  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
  Default
</span>
```

---

## 📦 Icon Containers

### Gradient Icon Box (Small)

```tsx
<div className="p-1.5 rounded-lg bg-linear-to-br from-slate-100 to-slate-200/80">
  <Icon className="w-4 h-4 text-slate-600" />
</div>
```

### Gradient Icon Box (Large)

```tsx
<div className="relative">
  <div className="w-12 h-12 bg-linear-to-br from-slate-500 via-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/25">
    <Icon className="w-6 h-6 text-white" />
  </div>
  {/* Subtle glow overlay */}
  <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent rounded-xl" />
</div>
```

---

## 🎯 Section Headers

### Header with Elegant Gradient Background

```tsx
<div className="relative bg-linear-to-r from-slate-50 via-slate-100/80 to-slate-50 px-6 py-5 border-b border-slate-200/60">
  {/* Top edge highlight */}
  <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-white to-transparent" />

  <div className="flex items-center gap-4">{/* Icon + Title content */}</div>
</div>
```

### Section Divider with Count Badge

```tsx
<div className="flex whitespace-nowrap items-center gap-2 mb-4 pb-2 border-b border-slate-200/60">
  <div className="p-1.5 rounded-lg bg-linear-to-br from-slate-100 to-slate-200/80">
    <Icon className="w-4 h-4 text-slate-600" />
  </div>
  <h3 className="font-bold text-slate-800">Section Title</h3>
  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
    {count}
  </span>
</div>
```

---

## 🌫️ Background Effects

### Radial Gradient Background Pattern

```tsx
{
  /* Add to card containers for subtle depth */
}
<div className="absolute inset-0 bg-radial-[ellipse_at_top_left] from-slate-50/50 via-transparent to-transparent pointer-events-none" />;
```

### Top Edge Highlight

```tsx
{
  /* Creates subtle 3D effect */
}
<div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />;
```

---

## 📐 Shadow System

| Usage     | Class                                          | Visual Effect          |
| --------- | ---------------------------------------------- | ---------------------- |
| Subtle    | `shadow-[0_2px_12px_-3px_rgba(51,65,85,0.08)]` | Light, minimal depth   |
| Default   | `shadow-[0_4px_24px_-4px_rgba(51,65,85,0.12)]` | Balanced, professional |
| Hover     | `shadow-[0_8px_24px_-6px_rgba(51,65,85,0.15)]` | Elevated, interactive  |
| Icon glow | `shadow-lg shadow-slate-500/25`                | Accent, emphasis       |

---

## 🔄 Transition Presets

### Standard Hover Transition

```css
transition-all duration-300 ease-out
hover:shadow-[0_8px_24px_-6px_rgba(51,65,85,0.15)]
hover:-translate-y-0.5
```

**Important**: Hover effects should only be applied to clickable/interactive elements. This maintains proper UX expectations and accessibility standards.

### Pulse Animation (for badges)

```css
animate-pulse
```

---

## 📋 Complete Card Example

```tsx
<div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/60">
  {/* Subtle background pattern */}
  <div className="absolute inset-0 bg-radial-[ellipse_at_top_left] from-slate-50/50 via-transparent to-transparent pointer-events-none" />

  {/* Header */}
  <div className="relative bg-linear-to-r from-slate-50 via-slate-100/80 to-slate-50 px-6 py-5 border-b border-slate-200/60">
    <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-white to-transparent" />
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 bg-linear-to-br from-slate-500 via-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/25">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent rounded-xl" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Title
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">Subtitle description</p>
      </div>
    </div>
  </div>

  {/* Content */}
  <div className="relative z-10 p-6">{/* Your content here */}</div>
</div>
```

---

## 🔧 Implementation Notes

### Tailwind CSS v4 Syntax

This design system uses Tailwind CSS v4 syntax:

- Use `bg-linear-to-*` instead of `bg-gradient-to-*`
- Use `bg-radial-[...]` for radial gradients
- Arbitrary values use square bracket notation

### Browser Support

- `backdrop-blur-sm` requires modern browsers
- Graceful degradation: Solid backgrounds fallback automatically

### Performance Tips

- Use `pointer-events-none` on all overlay layers
- Keep gradient layers to maximum 2-3 per component
- Use `z-10` for content layers to ensure proper stacking

---

## 📁 Files Using This System

- `app/(private)/profile/components/AddressInfoCard.tsx`
- `app/(private)/profile/components/BusinessInfoCard.tsx`
- `app/(private)/profile/components/PersonalInfoCard.tsx`
- `app/(private)/profile/components/ProfileHeader.tsx`

---

## 🎨 Extending the System

When creating new components, follow these principles:

1. **Layer gradients intentionally** - Max 2-3 overlay layers
2. **Use opacity variants** - Creates subtle, not harsh effects
3. **Include edge highlights** - Adds polish and depth
4. **Consistent shadows** - Use the shadow system above
5. **Smooth transitions** - `duration-300 ease-out` is the standard
6. **Hover effects only on interactive elements** - Maintain UX expectations and accessibility

---

_Last updated: February 2026_
