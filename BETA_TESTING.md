# MVP Labs (by IntelliForge AI) — Beta Testing Guide

> **Production URL:** https://buildwithaigiri.vercel.app
> **Deployment:** Vercel (auto-deploys on push to `master`)
> **Last updated:** March 2026

---

## 1. Testing Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| **Production** | `https://buildwithaigiri.vercel.app` | Live site, real Supabase data |
| **Preview** | `https://<branch>.vercel.app` | Auto-created per PR / branch push |
| **Local** | `http://localhost:3000` | Dev server with `.env.local` |

### Running Locally

```bash
npm install
cp .env.example .env.local   # Fill in Supabase + AgentMail keys
npm run dev                   # → http://localhost:3000
```

### Running Against Preview Deployment

Every push to a non-`master` branch generates a Vercel preview URL. Use it to test on real infrastructure without touching production.

```bash
git checkout -b beta/test-round-1
git push -u origin HEAD
# Vercel will print the preview URL in the deployment logs
```

---

## 2. Pages & Routes to Test

### Public Pages

| Page | Path | What to verify |
|------|------|----------------|
| Landing | `/` | Hero, badge, week counter, How It Works, About, FAQ accordion, CTA buttons, footer |
| Submit Idea | `/submit` | Full form rendering, validation, successful submission, form reset, anti-bot protection |
| Showcase | `/showcase` | Page loads, empty state or project cards, API response |

### Admin Pages

| Page | Path | What to verify |
|------|------|----------------|
| Dashboard | `/dashboard` | Stat cards, submissions table, search, status filter, refresh, approve flow |

### API Endpoints

| Method | Endpoint | What to verify |
|--------|----------|----------------|
| `POST` | `/api/submissions` | Accepts valid submission, rejects invalid, rate limiting, anti-bot fields |
| `GET` | `/api/submissions` | Returns submissions list (admin) |
| `GET` | `/api/projects` | Returns projects array |
| `POST` | `/api/admin/approve` | Approves submission, triggers calendar invite |
| `GET` | `/api/auth/google` | Initiates Google OAuth |
| `GET` | `/api/auth/google/callback` | Handles OAuth callback |

---

## 3. Manual Test Checklist

### 3.1 Landing Page (`/`)

- [ ] Page loads without errors (no console errors)
- [ ] Hero headline "25 MVPs. 25 Weeks. Completely Free." is visible
- [ ] "The Movement Has Begun" badge renders
- [ ] Founder identity card shows avatar with glow, name, role, and 3 social icons
- [ ] Social icons (LinkedIn, GitHub, Portfolio) open correct URLs in new tab
- [ ] Week counter stats display (Current Week, Total Weeks, Ideas Received, MVPs Built)
- [ ] "How It Works" section shows all 5 steps
- [ ] "About" section renders with 4 highlight cards
- [ ] FAQ accordion expands/collapses on click
- [ ] "Submit Your Idea" CTA navigates to `/submit`
- [ ] "How It Works" CTA smooth-scrolls to the section
- [ ] Footer renders all sections (Brand, Quick Links, The Movement, Connect)
- [ ] Copyright year is current (2026)

### 3.2 Idea Submission (`/submit`)

- [ ] All form fields render: Full Name, Email, Role, Company, Idea Title, Description, Target Audience, Business Model, Referral Source
- [ ] Submitting empty form shows "Name is required" error
- [ ] Invalid email shows "Invalid email" error
- [ ] Idea title < 5 chars shows "Title must be at least 5 characters"
- [ ] Short description shows "Describe your idea in more detail"
- [ ] Valid submission returns HTTP 201 and shows success toast
- [ ] Form fields reset after successful submission
- [ ] Submit button shows loading state / disables during submission
- [ ] Phone number field is present (if added)
- [ ] "Back to Home" link navigates to `/`

### 3.3 Showcase (`/showcase`)

- [ ] Page header "Project Showcase" is visible
- [ ] If no projects: "The Journey Begins Soon" empty state renders
- [ ] If projects exist: project cards render with title, description, tech stack, links
- [ ] `/api/projects` returns 200 with array response
- [ ] "Back to Home" link works

### 3.4 Dashboard (`/dashboard`)

- [ ] Dashboard header renders
- [ ] Stat cards: Total Submissions, Pending Review, In Progress, Completed
- [ ] Search field accepts input and filters results
- [ ] Status filter dropdown has all 8 options (All Statuses, Pending, etc.)
- [ ] Refresh button re-fetches data (observe network request)
- [ ] If no submissions: empty state shows "No submissions yet"
- [ ] If submissions exist: table rows render with correct data

### 3.5 Navigation & Responsive

- [ ] Navbar brand "MVP Labs" links to `/`
- [ ] Desktop nav links: How It Works, About, Showcase, FAQ, Submit Idea
- [ ] Mobile (375px): hamburger menu toggles, all links visible
- [ ] Mobile menu links navigate correctly and menu closes
- [ ] Footer links navigate to correct sections/pages
- [ ] All pages render correctly at 375px, 768px, 1024px, 1440px

### 3.6 Cross-Browser

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, if available)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android

### 3.7 Performance & SEO

- [ ] Lighthouse score > 90 for Performance (run on `/`)
- [ ] Lighthouse score > 90 for Accessibility
- [ ] Open Graph image renders when sharing URL on social media
- [ ] Page title and meta description are set correctly
- [ ] No layout shift (CLS < 0.1)

### 3.8 Security & Anti-Bot

- [ ] Honeypot field is hidden from real users
- [ ] Submitting with honeypot filled rejects the request
- [ ] Rate limiting prevents rapid-fire submissions
- [ ] No secrets exposed in client-side code (check browser devtools → Sources)

---

## 4. Automated E2E Tests (Playwright)

### Running Tests Locally

```bash
# Install browsers (first time only)
npx playwright install chromium

# Run all tests (starts dev server automatically)
npx playwright test

# Run with visible browser
npx playwright test --headed

# Run a specific test file
npx playwright test e2e/landing.spec.ts

# Interactive UI mode (best for debugging)
npx playwright test --ui

# View HTML report after run
npx playwright show-report
```

### Running Tests Against Production

```bash
BASE_URL=https://buildwithaigiri.vercel.app npx playwright test
```

### Running Tests Against Preview Deployment

```bash
BASE_URL=https://your-branch.vercel.app npx playwright test
```

### Existing Test Suites

| File | Tests | Coverage |
|------|-------|----------|
| `e2e/landing.spec.ts` | 9 | Hero, badge, week counter, How It Works, About, FAQ, CTA |
| `e2e/submit-idea.spec.ts` | 7 | Form fields, validation (5 cases), submission, reset, loading state |
| `e2e/navigation.spec.ts` | 7 | Page navigation, navbar, footer, mobile menu |
| `e2e/showcase.spec.ts` | 3 | Page header, empty state, API endpoint |
| `e2e/dashboard.spec.ts` | 8 | Header, stats, search, filter, refresh, empty state, API |

### Expected Output

```
Running 34 tests using 1 worker

  ✓ Landing Page > should render hero section with headline
  ✓ Landing Page > should render the movement badge
  ...
  34 passed (45s)
```

---

## 5. API Testing (Manual / cURL)

### Submit an Idea

```bash
curl -X POST https://buildwithaigiri.vercel.app/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Beta Tester",
    "email": "beta@example.com",
    "role": "Developer",
    "idea_title": "Beta Test Submission",
    "idea_description": "This is a test submission from the beta testing process to verify the API works correctly end to end."
  }'
```

**Expected:** HTTP 201, `{ "success": true, "message": "..." }`

### Fetch Projects

```bash
curl https://buildwithaigiri.vercel.app/api/projects
```

**Expected:** HTTP 200, JSON array

### Fetch Submissions (Admin)

```bash
curl https://buildwithaigiri.vercel.app/api/submissions
```

**Expected:** HTTP 200, JSON array

### Test Rate Limiting

```bash
# Run 10 rapid requests — later ones should return 429
for i in $(seq 1 10); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST \
    https://buildwithaigiri.vercel.app/api/submissions \
    -H "Content-Type: application/json" \
    -d '{"full_name":"Rate Test","email":"rate@test.com","idea_title":"Rate Limit Test","idea_description":"Testing that the rate limiter kicks in after too many rapid requests."}'
done
```

---

## 6. Database Verification (Supabase)

After submitting a test idea, verify in the Supabase dashboard:

1. Go to **Table Editor → submissions**
2. Confirm the new row exists with correct `full_name`, `email`, `idea_title`, `idea_description`
3. Confirm `status` is `pending`
4. Confirm `created_at` timestamp is correct

### Cleanup Test Data

```sql
-- Run in Supabase SQL Editor after testing
DELETE FROM submissions WHERE email LIKE '%@example.com';
DELETE FROM submissions WHERE email LIKE '%@test.com';
DELETE FROM submissions WHERE full_name = 'Beta Tester';
```

---

## 7. Email Notification Verification

After a successful submission:

1. Check the admin inbox for the notification email (via AgentMail)
2. Verify email contains: submitter name, email, idea title, description
3. Verify "Reply" or "View" link works

---

## 8. Known Issues & Caveats

| Issue | Impact | Workaround |
|-------|--------|------------|
| External profile image may load slowly | Founder card avatar delay | Image is cached after first load |
| Cal.com embed requires their JS | Calendar widget on submit page | Verify no console errors |
| Twitter link placeholder | Social link in footer | Update when real Twitter/X handle is set |

---

## 9. Bug Report Template

When reporting issues, include:

```
**Page/Feature:** [e.g., Submit Idea form]
**Browser & OS:** [e.g., Chrome 123 on Windows 11]
**Steps to Reproduce:**
1. Go to /submit
2. Fill in all fields
3. Click "Submit Your Idea"

**Expected Behavior:** Success toast appears, form resets
**Actual Behavior:** [What actually happened]
**Screenshot/Video:** [Attach if possible]
**Console Errors:** [Copy from browser devtools]
```

---

## 10. Testing Sign-Off

| Area | Tester | Date | Status |
|------|--------|------|--------|
| Landing page | | | ☐ |
| Submit form | | | ☐ |
| Showcase | | | ☐ |
| Dashboard | | | ☐ |
| Navigation | | | ☐ |
| Mobile responsive | | | ☐ |
| Cross-browser | | | ☐ |
| API endpoints | | | ☐ |
| E2E tests pass | | | ☐ |
| Performance | | | ☐ |
| Security | | | ☐ |
