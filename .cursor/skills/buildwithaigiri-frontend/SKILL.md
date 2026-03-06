---
name: buildwithaigiri-frontend
description: Build and maintain the BuildwithAiGiri Next.js frontend with dark theme, animations, and responsive design. Use when creating pages, components, forms, or styling for the movement website.
---

# BuildwithAiGiri Next.js Frontend

## Tech Stack

```json
{
  "dependencies": {
    "next": "^15.1",
    "react": "^19",
    "react-dom": "^19",
    "@supabase/supabase-js": "^2",
    "@radix-ui/react-accordion": "^1",
    "@radix-ui/react-dialog": "^1",
    "class-variance-authority": "^0.7",
    "clsx": "^2.1",
    "tailwind-merge": "^2.5",
    "lucide-react": "^0.460",
    "framer-motion": "^12",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^3",
    "zod": "^3",
    "sonner": "^1"
  }
}
```

## Supabase Client

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// For API routes (server-side with elevated privileges)
import { createClient as createServerClient } from "@supabase/supabase-js";

export function getServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
```

## Component Patterns

### Page Template

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function FeaturePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/endpoint")
      .then((r) => r.json())
      .then(setData)
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Content */}
    </motion.div>
  );
}
```

### Glass Card

```tsx
<div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-cyan-500/30 transition-colors">
  {/* Card content */}
</div>
```

### Loading Skeleton

```tsx
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
      <div className="h-4 w-full animate-pulse rounded bg-white/5" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
    </div>
  );
}
```

## Form Pattern (React Hook Form + Zod)

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  idea_title: z.string().min(5, "Title must be at least 5 characters"),
  idea_description: z.string().min(20, "Describe your idea in more detail"),
});

type FormData = z.infer<typeof schema>;

export function IdeaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      toast.error("Submission failed. Please try again.");
      return;
    }
    toast.success("Idea submitted! We'll be in touch.");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Full Name
        </label>
        <input
          {...register("full_name")}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
          placeholder="Your name"
        />
        {errors.full_name && (
          <p className="mt-1 text-xs text-red-400">{errors.full_name.message}</p>
        )}
      </div>
      {/* More fields... */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white hover:bg-cyan-400 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? "Submitting..." : "Submit Your Idea"}
      </button>
    </form>
  );
}
```

## Animation Patterns

### Scroll-Triggered Fade In

```tsx
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
};

<motion.div {...fadeInUp}>
  {/* Content appears on scroll */}
</motion.div>
```

### Staggered Children

```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

<motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {items.map((i) => (
    <motion.div key={i.id} variants={item}>{/* ... */}</motion.div>
  ))}
</motion.div>
```

### Counter Animation

```tsx
import { useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

function AnimatedCounter({ target }: { target: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) motionValue.set(target);
  }, [isInView, target, motionValue]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
```

## Styling Conventions

### CSS Variables (globals.css)

```css
:root {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --muted: #a1a1aa;
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
  --accent: #06b6d4;
  --accent-green: #22c55e;
}
```

### Reusable Classes

- **Glass card**: `bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl`
- **Primary button**: `bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg px-6 py-3`
- **Secondary button**: `bg-white/10 hover:bg-white/20 text-white rounded-lg px-6 py-3`
- **Input field**: `bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500`
- **Section title**: `text-3xl sm:text-4xl font-bold text-white`
- **Section subtitle**: `text-lg text-gray-400 max-w-2xl`

## Key Rules

1. **Dark theme everywhere** -- no light mode for this project
2. **Never use `alert()`** -- use `toast.success()` / `toast.error()` from sonner
3. **Always provide loading skeletons** -- never blank screens
4. **Always define TypeScript interfaces** for data shapes
5. **Use `cn()` from `lib/utils.ts`** for conditional class merging
6. **Mobile-first** -- design for 375px, then scale up with `sm:`, `md:`, `lg:`
7. **Icons from `lucide-react` only** -- no mixing icon libraries
