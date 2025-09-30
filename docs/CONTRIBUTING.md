# Contributing to Zero Zero

Thank you for your interest in contributing to Zero Zero! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on the mission: helping people save money and reduce carbon
- Keep discussions constructive and on-topic
- Follow the design philosophy (minimalist, black/white, lowercase)

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/zero-zero/issues)
2. Create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Browser/device information

**Bug Report Template**:
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120
- Device: iPhone 14 Pro
- OS: iOS 17
```

### Suggesting Features

1. Check [existing feature requests](https://github.com/yourusername/zero-zero/issues?q=is%3Aissue+label%3Aenhancement)
2. Create a new issue with label `enhancement`
3. Include:
   - User problem being solved
   - Proposed solution
   - Alternative solutions considered
   - Impact on existing functionality

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/zero-zero.git
   cd zero-zero
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the code style guide (below)
   - Add tests if applicable
   - Update documentation

3. **Test thoroughly**
   ```bash
   npm run dev
   # Test all journeys, chat, results, likes
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add carbon comparison to results page"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub

## Code Style Guide

### Design Philosophy

Zero Zero follows strict design rules:

#### Colors
- **Only** black (`#000`) and white (`#fff`)
- No grays, no colors, no gradients
- Exception: Transparent overlays for hover states

#### Typography
- **Font**: Roboto only (weights: 300, 400, 900)
- **All lowercase** for user-facing text
- **No custom font sizes** in Tailwind classes
- Use CSS variables:
  ```css
  --h1: 100px   /* intro super */
  --h2: 80px    /* homepage questions */
  --h3: 60px    /* journey questions */
  --h4: 40px    /* subheadings */
  --body: 20px  /* default text */
  --chat-meta: 12px /* helper text */
  ```

#### Spacing
- No shadows (except focus rings for accessibility)
- No borders (except input underlines)
- Consistent padding: 16px standard
- Border radius: 40px for cards, 50% for buttons

#### Animations
- Typewriter: 65ms per character
- Transitions: 200-300ms max
- Respect `prefers-reduced-motion`

### React/TypeScript Guidelines

#### File Structure
```
/components/YourComponent.tsx    # PascalCase
/utils/yourUtility.ts           # camelCase
/styles/globals.css             # kebab-case
```

#### Component Template
```tsx
import React, { useState } from 'react';

interface YourComponentProps {
  onAction: (value: string) => void;
  data?: any;
}

export function YourComponent({ onAction, data }: YourComponentProps) {
  const [state, setState] = useState('');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Component content */}
    </div>
  );
}
```

#### Naming Conventions
- **Components**: PascalCase (`ResultsPage`, `ChatBubble`)
- **Functions**: camelCase (`handleClick`, `computeFootprint`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RESULTS`, `API_ENDPOINT`)
- **Props interfaces**: `ComponentNameProps`

#### State Management
- Use React hooks (`useState`, `useEffect`)
- Keep state in `/App.tsx` for shared data
- Pass down via props (no Redux/Context for now)

### CSS/Tailwind Guidelines

#### Preferred Pattern
```tsx
// ✅ Good: Use CSS variables
<h3 style={{ fontSize: 'var(--h3)' }}>question text</h3>

// ❌ Bad: Hardcode font sizes
<h3 className="text-6xl">question text</h3>
```

#### Class Organization
```tsx
<div className="
  // Layout
  flex items-center justify-center
  // Spacing
  p-4 gap-2
  // Sizing
  w-full max-w-md
  // Colors (use utility classes)
  bg-black text-white
  // Effects
  transition-all duration-300
">
```

#### Responsive Design
```tsx
// Mobile-first approach
<div className="
  p-4           // Mobile: 16px padding
  md:p-8        // Desktop: 32px padding
  max-w-[480px] // Universal wrapper
  mx-auto       // Center content
">
```

### codeWordAPI Contributions

When adding new API mock functions:

1. **Follow naming convention**: `codeWordAPI_descriptiveName()`
2. **Add comprehensive JSDoc**:
   ```typescript
   /**
    * TODO: Replace with [Real API Name]
    * @param param1 - Description
    * @param param2 - Description
    * @returns Description of return value
    */
   export async function codeWordAPI_yourFunction(param1: string, param2: number) {
     await new Promise(resolve => setTimeout(resolve, 200)); // Simulate delay
     
     return {
       // Mock data structure
     };
   }
   ```
3. **Include error handling**:
   ```typescript
   try {
     // API call
   } catch (error) {
     console.error('API error:', error);
     return mockFallbackData;
   }
   ```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples**:
```bash
feat(chat): add message persistence
fix(journey): resolve slider thumb visibility
docs(api): update integration guide
style(results): adjust card spacing
refactor(utils): simplify carbon calculations
```

## Testing Checklist

Before submitting a PR, test:

### Desktop (Chrome, Firefox, Safari)
- [ ] Homepage loads correctly
- [ ] Intro animation plays smoothly
- [ ] All 7 journeys complete successfully
- [ ] Results page displays comparison cards
- [ ] Chat responds to messages
- [ ] Likes page saves/removes items
- [ ] Back navigation works
- [ ] Home button returns to homepage

### Mobile (iPhone, Android)
- [ ] Responsive layout (max 480px width)
- [ ] Touch interactions work
- [ ] Keyboard doesn't break layout
- [ ] Location permission prompt works
- [ ] Scrolling is smooth
- [ ] No horizontal overflow

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Screen reader compatible (test with VoiceOver/NVDA)
- [ ] Respects `prefers-reduced-motion`
- [ ] Color contrast sufficient (black/white = perfect!)

### Performance
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] No memory leaks (check DevTools)
- [ ] Fast page transitions

## Project Structure

```
/
├── components/
│   ├── IntroPage.tsx          # Welcome animation
│   ├── Homepage.tsx           # Main menu
│   ├── ChatPage.tsx           # Zai assistant
│   ├── JourneyPage.tsx        # Question flow
│   ├── ResultsPage.tsx        # Comparison results
│   ├── LikesPage.tsx          # Saved items
│   ├── LocationPermissionPrompt.tsx
│   ├── PillChoices.tsx        # Answer buttons
│   ├── ZaiChatBubble.tsx      # Chat message
│   └── ui/                    # Shadcn components
├── utils/
│   ├── codeWordAPI.ts         # 🔑 Mock API layer
│   ├── computeFootprint.ts    # Carbon calculator
│   ├── buildTips.ts           # Tip generator
│   └── locationUtils.ts       # Location helpers
├── styles/
│   └── globals.css            # Design system
├── imports/                   # Figma assets
├── App.tsx                    # Main app
└── README.md                  # Documentation
```

## Documentation

When adding features, update:

1. **README.md** - User-facing changes
2. **API_INTEGRATION_GUIDE.md** - New API mocks
3. **DEPLOYMENT.md** - Build/deploy changes
4. **Inline comments** - Complex logic
5. **JSDoc** - All functions

## Getting Help

- **General questions**: [GitHub Discussions](https://github.com/yourusername/zero-zero/discussions)
- **Bug reports**: [GitHub Issues](https://github.com/yourusername/zero-zero/issues)
- **Feature requests**: [GitHub Issues](https://github.com/yourusername/zero-zero/issues/new?labels=enhancement)
- **Design questions**: Reference `/styles/globals.css` and existing components

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the About page (when added)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Zero Zero better! 🌍💚