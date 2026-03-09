---
name: anti-bot-form-protection
description: Protect public-facing forms from spam and bot abuse using zero-friction techniques. Use when adding forms, protecting submission endpoints, preventing spam, or when the user mentions bot protection, honeypot, rate limiting, or form abuse.
---

# Anti-Bot Form Protection

Zero-friction, no-dependency anti-bot protection for Next.js forms. No CAPTCHAs, no third-party services — invisible to real users.

## Protection Layers

### 1. Honeypot Field (catches dumb bots)

Hidden input that bots auto-fill but humans never see. If filled, silently return success (201) without saving — the bot thinks it worked.

**Client (React component):**

```tsx
const honeypotRef = useRef<HTMLInputElement>(null);

// Inside <form>, before submit button:
<div aria-hidden="true" className="absolute opacity-0 h-0 w-0 overflow-hidden" tabIndex={-1}>
  <label htmlFor="_website">Website</label>
  <input id="_website" ref={honeypotRef} type="text" name="_website" autoComplete="off" tabIndex={-1} />
</div>
```

**Send with form data:**

```tsx
body: JSON.stringify({
  ...data,
  _hp: honeypotRef.current?.value || "",
})
```

**Server check:**

```ts
if (body._hp) {
  return NextResponse.json({ success: true, message: "Submitted!" }, { status: 201 });
}
```

Key rules:
- Use `aria-hidden`, `opacity-0`, `h-0 w-0 overflow-hidden` (never `display:none` — some bots skip those)
- Use a tempting field name like `_website` or `_url`
- Return fake 201 success — never reveal detection

### 2. Timing Check (catches fast bots)

Record when form loads, reject submissions under a threshold (3s default).

**Client:**

```tsx
const loadedAt = useRef<number>(Date.now());

useEffect(() => { loadedAt.current = Date.now(); }, []);

// Send with form data:
body: JSON.stringify({ ...data, _t: loadedAt.current })
```

**Server check:**

```ts
const MIN_FILL_TIME_MS = 3_000;

if (body._t && Date.now() - Number(body._t) < MIN_FILL_TIME_MS) {
  return NextResponse.json(
    { error: "Please take your time filling out the form." },
    { status: 422 },
  );
}
```

Adjust `MIN_FILL_TIME_MS` based on form complexity (more fields = higher threshold).

### 3. In-Memory Rate Limiting (per IP)

```ts
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 3, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
```

Usage in API route:

```ts
const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
if (!checkRateLimit(ip)) {
  return NextResponse.json({ error: "Too many requests." }, { status: 429 });
}
```

**Note**: In-memory maps reset on serverless cold starts. For persistent rate limiting, use Redis or Upstash.

### 4. Strip Meta Fields Before Validation

Always remove `_hp` and `_t` before passing to Zod:

```ts
const { _hp, _t, ...formData } = body;
const parsed = submissionSchema.safeParse(formData);
```

## Implementation Checklist

- [ ] Add honeypot `<input>` with `useRef` (hidden, tempting name)
- [ ] Record `loadedAt` timestamp with `useRef` + `useEffect`
- [ ] Send `_hp` and `_t` alongside form data in fetch body
- [ ] Server: check `_hp` first → fake 201 if filled
- [ ] Server: check `_t` → reject if < `MIN_FILL_TIME_MS`
- [ ] Server: check rate limit → 429 if exceeded
- [ ] Server: strip `_hp` and `_t` before Zod validation

## Reference Implementation

- Client: `src/components/IdeaForm.tsx`
- Server: `src/app/api/submissions/route.ts`
