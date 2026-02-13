# Agent Monitoring Dashboard - UI Specifications

## Visual Design Overview

The Agent Monitoring Dashboard follows the established Command Center design language with sage green (#8B9A7E) and charcoal (#2C2C2C) color scheme, clean typography, and professional card-based layout.

## Color Palette

```css
/* Primary Colors */
--linen: #F5F0EB;           /* Background */
--sage: #8B9A7E;            /* Primary accent */
--terracotta: #C47B5C;      /* Error/warning */
--brass: #B8860B;           /* Gold accents */
--charcoal: #2C2C2C;        /* Primary text */
--warm-white: #FEFEFE;      /* Card backgrounds */

/* Status Colors */
--working: #FFD700;         /* Yellow - Active agents */
--completed: #8B9A7E;       /* Sage - Finished tasks */
--failed: #C47B5C;          /* Terracotta - Errors */
--stalled: #FF6B6B;         /* Orange-red - Stalled */
--spawning: #87CEEB;        /* Sky blue - Starting */
```

## Typography

```css
/* Primary Font */
font-family: 'DM Sans', sans-serif;

/* Monospace Font */
font-family: 'JetBrains Mono', monospace; /* For IDs, paths, metrics */

/* Font Weights */
400 - Regular text
500 - Medium (labels, buttons)
600 - Semibold (headings, important text)
700 - Bold (large numbers, emphasis)
```

## Layout Structure

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│ Header Section                                          │
│ ┌─────────────────┐    ┌─────────────────────────────┐ │
│ │ 🤖 Live Agent   │    │ [⏹️ Pause] [🔄 Refresh]   │ │
│ │ Monitor         │    │                             │ │
│ │ Last: 20:28:15  │    │                             │ │
│ └─────────────────┘    └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Alert Bar (when needed)                                 │
│ ⚠️ Intervention Required: 2 stalled agents 1 failed    │
├─────────────────────────────────────────────────────────┤
│ Statistics Grid                                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│ │    3    │ │    2    │ │    1    │ │    0    │       │
│ │Working⚡│ │Complete✅│ │Stalled⚠️│ │Failed❌│       │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
├─────────────────────────────────────────────────────────┤
│ Agent Cards Grid                                        │
│ ┌─────────────────┐ ┌─────────────────┐               │
│ │ Agent Card 1    │ │ Agent Card 2    │               │
│ │                 │ │                 │               │
│ └─────────────────┘ └─────────────────┘               │
│ ┌─────────────────┐                                   │
│ │ Agent Card 3    │                                   │
│ │                 │                                   │
│ └─────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
```

## Component Specifications

### 1. Header Section
- **Height**: 80px
- **Padding**: 24px
- **Background**: Transparent
- **Border**: Bottom 1px solid rgba(139, 154, 126, 0.2)

**Title**
- **Font**: DM Sans, 28px, 600 weight
- **Color**: #2C2C2C
- **Icon**: 🤖 (24px)

**Timestamp**
- **Font**: JetBrains Mono, 12px, 400 weight
- **Color**: rgba(44, 44, 44, 0.6)

**Action Buttons**
- **Size**: 32px height, 8px border-radius
- **Primary**: #8B9A7E background, white text
- **Secondary**: rgba(139, 154, 126, 0.1) background, #8B9A7E text

### 2. Alert Bar
- **Background**: #FFF3CD (warning yellow)
- **Border**: 1px solid #FFE69C
- **Padding**: 12px 16px
- **Border-radius**: 8px
- **Font**: 14px, 500 weight
- **Color**: #856404

### 3. Statistics Grid
- **Layout**: 4 equal columns, 16px gap
- **Card Size**: Auto-height, 12px border-radius
- **Background**: #FEFEFE
- **Shadow**: 0 2px 8px rgba(44, 44, 44, 0.06)
- **Padding**: 20px

**Stat Values**
- **Font**: DM Sans, 32px, 700 weight
- **Color**: #8B9A7E (default), status colors for alerts

**Stat Labels**
- **Font**: DM Sans, 12px, 500 weight, uppercase
- **Color**: rgba(44, 44, 44, 0.6)
- **Letter-spacing**: 0.5px

### 4. Agent Cards Grid
- **Layout**: Auto-fill, minmax(400px, 1fr), 20px gap
- **Mobile**: Single column below 768px

### 5. Agent Card Design

```
┌─────────────────────────────────────────────────────┐
│ ┌─ Agent Name                    🔴 Priority ─┐    │
│ │  ⚡ WORKING                                   │    │
│ └────────────────────────────────────────────────┘    │
│                                                     │
│ Task: Merge Light's authentics + Claude's...       │
│                                                     │
│ Progress: ████████████░░░░ 65%                     │
│                                                     │
│ Tokens: 15,420 / 50,000    Runtime: 12m 45s       │
│ ETA: 21:30:00                                       │
│                                                     │
│ Output: CONSTITUTION-V3.md                          │
│ ID: 2062390b...    Last: 20:25:00                  │
│                                                     │
│ [🛑 Stop] [📋 Logs]                                │
│                                                     │
│ ┌─ Logs (expandable) ─────────────────────────┐     │
│ │ 20:25:00 INFO Processing merge request      │     │
│ │ 20:24:30 DEBUG Analyzing principles         │     │
│ └──────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

**Card Dimensions**
- **Width**: 400px minimum, flexible
- **Height**: Auto-sizing
- **Padding**: 20px
- **Border-radius**: 12px
- **Border-left**: 4px solid (status color)

**Status Colors & Left Border**
- **Working**: #FFD700 (gold)
- **Completed**: #8B9A7E (sage)
- **Failed**: #C47B5C (terracotta)
- **Stalled**: #C47B5C (terracotta)
- **Spawning**: #87CEEB (sky blue)

**Agent Name**
- **Font**: DM Sans, 16px, 600 weight
- **Color**: #2C2C2C

**Status Badge**
- **Font**: DM Sans, 12px, 600 weight, uppercase
- **Letter-spacing**: 0.5px
- **Color**: Status color

**Task Description**
- **Font**: DM Sans, 14px, 400 weight
- **Color**: rgba(44, 44, 44, 0.7)
- **Line-height**: 1.4
- **Max-lines**: 2 with ellipsis

**Progress Bar**
- **Height**: 8px
- **Background**: rgba(139, 154, 126, 0.1)
- **Fill**: Status color
- **Border-radius**: 4px

**Metrics Grid**
- **Layout**: 2 columns, 16px gap
- **Labels**: 11px, uppercase, 500 weight, rgba(44, 44, 44, 0.5)
- **Values**: 13px, JetBrains Mono, 600 weight, #2C2C2C

**Action Buttons**
- **Height**: 28px
- **Font**: 11px, 600 weight, uppercase
- **Border-radius**: 4px
- **Gap**: 8px between buttons

**Button Styles**
- **Respawn**: #E3F2FD background, #1976D2 text
- **Kill/Stop**: #FFEBEE background, #D32F2F text  
- **Logs**: rgba(139, 154, 126, 0.1) background, #8B9A7E text

### 6. Logs Panel
- **Background**: rgba(139, 154, 126, 0.03)
- **Border-radius**: 6px
- **Padding**: 8px
- **Max-height**: 200px with scroll

**Log Entries**
- **Font**: JetBrains Mono, 11px
- **Layout**: CSS Grid (time, level, message)
- **Gap**: 8px between columns
- **Colors**:
  - DEBUG: #666
  - INFO: #2196F3  
  - WARN: #FF9800
  - ERROR: #F44336

## Responsive Breakpoints

### Desktop (>= 1024px)
- 4-column stats grid
- 2-3 agent cards per row
- Full feature set

### Tablet (768px - 1023px)  
- 2-column stats grid
- 1-2 agent cards per row
- Compact metrics

### Mobile (< 768px)
- 2-column stats grid
- 1 agent card per row
- Stacked metrics
- Smaller buttons

## Animation & Interactions

### Loading States
- **Spinner**: 32px, sage color, 1s linear rotation
- **Skeleton**: Subtle pulse animation on loading cards

### Hover Effects
- **Cards**: Lift shadow (0 4px 16px rgba(44, 44, 44, 0.1))
- **Buttons**: 10% darker background
- **Duration**: 0.2s ease

### Transitions
- **Progress bars**: 0.3s ease width changes
- **Status changes**: 0.2s color transitions
- **Card expansion**: 0.3s ease height changes

## Accessibility

### Color Contrast
- **Text on white**: 4.5:1 minimum ratio
- **Status indicators**: Icons + color for colorblind users
- **Focus states**: 2px outline in sage color

### Keyboard Navigation
- **Tab order**: Logical flow through actions
- **Enter/Space**: Activate buttons
- **Escape**: Close modals/logs

### Screen Readers
- **ARIA labels**: All interactive elements
- **Status announcements**: Live region updates
- **Semantic HTML**: Proper heading hierarchy

## Performance Considerations

### Rendering Optimization
- **React.memo**: Prevent unnecessary re-renders
- **Virtual scrolling**: For large agent lists (>20)
- **Debounced updates**: Throttle rapid state changes

### Network Optimization
- **Request batching**: Combine API calls where possible
- **Caching**: Store recent agent data
- **Compression**: Gzip API responses

## Browser Support

### Modern Browsers
- **Chrome**: 88+ (ES2020, CSS Grid)
- **Firefox**: 85+ 
- **Safari**: 14+
- **Edge**: 88+

### Fallbacks
- **CSS Grid**: Flexbox fallback for older browsers
- **WebSocket**: Graceful degradation to polling
- **Modern fonts**: System font fallbacks

This specification provides complete visual and technical guidance for implementing the Agent Monitoring Dashboard with professional quality and user experience.