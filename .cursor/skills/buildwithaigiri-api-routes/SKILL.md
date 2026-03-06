---
name: buildwithaigiri-api-routes
description: Guides creation of Next.js API routes following BuildwithAiGiri conventions. Use when adding new endpoints, creating API routes, or asking about the API structure, rate limiting, validation, or Supabase integration.
---

# BuildwithAiGiri API Routes

## Route Structure

All API routes live under `src/app/api/`. Each route is a directory with a `route.ts` file.

```
src/app/api/
├── submissions/route.ts    # POST: submit idea, GET: list (admin)
└── projects/route.ts       # GET: public project list
```

## Supabase Server Client

Use the service role client for API routes (bypasses RLS for admin operations):

```typescript
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
```

## Route Templates

### Public POST Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const schema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  idea_title: z.string().min(5),
  idea_description: z.string().min(20),
  role: z.string().optional(),
  company: z.string().optional(),
  target_audience: z.string().optional(),
  business_model: z.string().optional(),
  referral_source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate input
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    // 2. Rate limit (by IP or email)
    const rl = checkRateLimit(`submit:${result.data.email}`, 3, 3600);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Too many submissions. Try again in ${rl.resetInSeconds}s.` },
        { status: 429 },
      );
    }

    // 3. Insert into Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { error } = await supabase
      .from("submissions")
      .insert({ ...result.data, status: "pending" });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    // 4. Send notification email (non-blocking)
    // sendSubmissionNotification(result.data).catch(() => {});

    return NextResponse.json({ success: true, message: "Idea submitted!" });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
```

### Public GET Route

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("week_number", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

## Rate Limiting

In-memory rate limiter for public endpoints:

```typescript
// lib/rate-limit.ts
const hits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, max: number, windowSeconds: number) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, resetInSeconds: windowSeconds };
  }

  if (entry.count >= max) {
    const resetInSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, resetInSeconds };
  }

  entry.count++;
  return { allowed: true, resetInSeconds: Math.ceil((entry.resetAt - now) / 1000) };
}
```

## Response Conventions

```typescript
// Error responses -- always { error: string }
return NextResponse.json({ error: "What went wrong" }, { status: 400 });
return NextResponse.json({ error: "Not found" }, { status: 404 });
return NextResponse.json({ error: "Too many requests" }, { status: 429 });

// Success responses -- { success: true, message } for mutations
return NextResponse.json({ success: true, message: "Created!" });

// Success responses -- direct data for queries
return NextResponse.json(dataArray);
```

## Checklist for New Routes

1. Create directory: `src/app/api/your-route/route.ts`
2. Choose auth level: public or protected
3. Validate input with Zod for POST endpoints
4. Add rate limiting for user-facing POST endpoints
5. Use Supabase service client for DB operations
6. Return `{ error: string }` on failure, `{ success: true }` on success
7. Log errors with `console.error()` for debugging

## Key Rules

1. **Always validate inputs** with Zod before DB operations
2. **Always rate limit** public POST endpoints
3. **Never expose `SUPABASE_SERVICE_ROLE_KEY`** to the client
4. **Use service role client** in API routes for admin operations
5. **Use anon key client** for public read-only queries
