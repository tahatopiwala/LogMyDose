# LogMyDose: Protocol & Dosage Tracking Platform

## Executive Summary

A dosage tracking platform launching with **peptide therapy** as the initial vertical, built to expand into HRT, supplements, nootropics, and prescription medications.

**Dual Go-to-Market:** Direct-to-consumer (users self-manage using protocol templates) + Clinic integration (clinics optionally manage their patients).

**Core Value Prop:** AI-powered peptide therapy management that proactively guides users - replacing Reddit/forum advice with intelligent, personalized insights. No chat interface; AI works for you, surfacing what matters when it matters.

**AI Differentiator:** Ambient intelligence through proactive insight cards, inline annotations, contextual decision support, smart UI highlights, periodic AI reports, and tap-to-explain "Why" layer. AI that tells you what you need to know vs. waiting for you to ask.

**Tech Stack:** Native iOS (Swift) → Android later, Express.js/TypeScript backend, React (Vite) web portals, PostgreSQL (Supabase), Supabase Storage, Stripe, LLM API (Anthropic/OpenAI)

**Launch Vertical:** Peptide therapy (BPC-157, Semaglutide, etc.)

**Future Verticals:**
- Hormone Replacement (TRT, estrogen, thyroid)
- Supplements & Nootropics
- Prescription medications
- Fertility treatments

**Business Model:**
- **D2C:** $9.99/month subscription (free tier available)
- **B2B:** Clinic subscription $99-299/month + $3-5/patient/month
- **Revenue Mix:** Start D2C to build user base, add clinic partnerships for revenue scale

**Exit Target:** Acquisition by telehealth/health tech platform at 6-9x revenue

**Timeline:** 9-12 months (solo developer)

**Launch Strategy:** Stealth build → Waitlist → Controlled launch

---

## 0. Peptide Vertical Launch Action Plan

### Launch Philosophy

**Stealth + Waitlist Approach:**
- Build in private, no public announcements during development
- Create anticipation through targeted content and community presence
- Collect waitlist emails to validate demand and build launch audience
- Controlled launch to waitlist first, iterate, then open to public

### Target User Segments

| Segment | Profile | Size | Priority |
|---------|---------|------|----------|
| **Self-Optimizers** | Biohackers on Reddit/Twitter, research-driven, gray market buyers, track everything | Large | P0 |
| **Semaglutide Users** | Weight loss focused, often prescribed via telehealth, need adherence help | Very Large | P0 |
| **Clinic Patients** | Getting peptides from HRT/wellness clinics, want better tracking than spreadsheets | Medium | P1 |
| **Curious Newcomers** | Interested but overwhelmed, need guidance to start safely | Large | P1 |

### Phase 0: Research & Validation (Weeks 1-4)

**Objective:** Understand the audience deeply before building

#### 0.1 Community Immersion
- [ ] Join and observe key subreddits daily:
  - r/Peptides (165k+ members)
  - r/semaglutide (150k+ members)
  - r/Tirzepatide
  - r/HGH
  - r/moreplatesmoredates
  - r/Biohackers
- [ ] Document common questions, frustrations, and requests
- [ ] Identify power users and helpful community members
- [ ] Note language/terminology used (for copywriting)
- [ ] Track what tools people currently use (spreadsheets, apps, nothing)

#### 0.2 Competitive Analysis
- [ ] Download and test every peptide/dose tracking app
- [ ] Document their weaknesses (reviews, Reddit complaints)
- [ ] Identify positioning gaps
- [ ] Screenshot UX patterns that work/don't work

#### 0.3 User Interviews (Optional but valuable)
- [ ] Reach out to 5-10 active Reddit users for 15-min calls
- [ ] Ask about their current tracking methods
- [ ] Understand pain points and wish lists
- [ ] Offer early access in exchange for feedback

**Deliverables:**
- User persona documents
- Competitive landscape map
- Feature priority list validated by research
- Swipe file of community language

---

### Phase 1: Stealth Build + Content Foundation (Months 1-3)

**Objective:** Build MVP while establishing content presence

#### 1.1 Landing Page & Waitlist

**Landing Page Elements:**
```
LogMyDose - Track Your Protocol. Optimize Your Results.

The AI-powered app for peptide therapy tracking.
- Log doses in seconds
- Get personalized insights (not generic advice)
- Track progress, side effects, and bloodwork
- Know what's working and what to adjust

[Join the Waitlist] - Be first to access

"Built by someone who was tired of tracking
peptides in spreadsheets and guessing if
things were working."
```

**Waitlist Mechanics:**
- Simple email capture (ConvertKit, Loops, or Buttondown)
- Thank you page with "What peptides are you interested in?" survey
- Segment list by: peptide type, experience level, clinic vs self-managed
- Occasional update emails (monthly) to keep warm

**Waitlist Goal:** 1,000+ emails before launch

#### 1.2 Content Strategy (Stealth Authority Building)

**Content Pillars:**

| Pillar | Purpose | Format |
|--------|---------|--------|
| **Education** | Build trust, SEO, shareable | Blog posts, guides |
| **Data/Research** | Establish credibility | Research summaries, studies |
| **Community Value** | Give before asking | Reddit answers, helpful comments |
| **Behind-the-scenes** | Build anticipation | Email updates to waitlist |

**Content Calendar (Weekly):**

| Day | Activity |
|-----|----------|
| Monday | Publish 1 blog post (SEO-focused) |
| Tue-Thu | Answer 2-3 Reddit questions helpfully (no promotion) |
| Friday | Share interesting peptide research on Twitter |
| Monthly | Email update to waitlist (progress, insights, sneak peeks) |

**Blog Content Ideas (SEO + Value):**

*Beginner Guides:*
- "BPC-157: Complete Beginner's Guide (Dosing, Timing, What to Expect)"
- "How to Reconstitute Peptides: Step-by-Step with Photos"
- "Semaglutide Titration Schedule: Week-by-Week Breakdown"
- "Peptide Storage 101: Refrigeration, Shelf Life, and Potency"

*Intermediate/Research:*
- "BPC-157 + TB-500: Synergy, Dosing, and Stacking Protocols"
- "Tracking Your Peptide Progress: What Bloodwork to Get and When"
- "Common Peptide Side Effects and How to Manage Them"
- "Injection Site Rotation: Why It Matters and How to Track It"

*Comparison/Decision:*
- "Semaglutide vs Tirzepatide: Differences, Results, Side Effects"
- "CJC-1295 vs Sermorelin: Which GH Secretagogue Is Right for You?"

**Reddit Strategy (Give Value, Don't Promote):**

Rules:
- Never mention LogMyDose or link to it
- Be genuinely helpful with detailed answers
- Build reputation as knowledgeable community member
- Use a personal account, not branded
- Only after 3+ months of value, subtly mention "working on something"

Example helpful answer:
```
"For BPC-157 dosing, most people start at 250mcg 2x/day
(morning and evening). Inject subcutaneously, rotate sites.

Timeline-wise, don't expect miracles in week 1 - most
people report noticeable effects around week 3-4 for
gut issues, 4-6 weeks for injuries.

Keep a log of your symptoms/pain levels so you can
actually see if it's working. Easy to forget how bad
things were when you started."
```

#### 1.3 Social Presence (Low-key)

**Twitter/X:**
- Personal account, not branded
- Share peptide research, insights, learnings
- Engage with biohacking/longevity community
- Build following of 1-2k before launch
- Occasionally hint at "building something"

**No presence yet on:**
- Instagram (save for launch)
- TikTok (save for post-launch)
- YouTube (save for post-launch)

---

### Phase 2: Beta Preparation (Months 3-4)

**Objective:** Prepare for controlled beta launch

#### 2.1 Beta Cohort Selection

From waitlist, select 50-100 beta users:

| Criteria | Why |
|----------|-----|
| Active on Reddit/Twitter | Will give feedback, potential advocates |
| Mix of peptides (BPC, Sema, GH, etc.) | Test breadth of use cases |
| Mix of experience levels | Beginner vs advanced UX needs |
| Engaged with emails | Opened/clicked previous updates |

**Beta Invitation Email:**
```
Subject: You're invited: LogMyDose Beta Access

Hey [name],

You signed up for LogMyDose [X] months ago. We've been
building quietly, and it's time for real users to try it.

You're one of 50 people getting early access.

What you get:
- Free access during beta (and discounted after)
- Direct line to me for feedback
- Your input shapes the product

What I ask:
- Use it for 2+ weeks
- Log your doses and side effects
- Tell me what's broken, missing, or confusing

[Get Beta Access]

This is invite-only. Please don't share publicly yet.

- [Your name]
```

#### 2.2 Beta Feedback System

- Private Slack/Discord channel for beta users
- Weekly feedback form (short, 3-5 questions)
- 1-on-1 calls with most engaged users
- Track: feature requests, bugs, confusion points, praise

#### 2.3 Success Metrics for Beta

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Day 7 retention | >40% | Are people coming back? |
| Doses logged per user | >10 in first 2 weeks | Core action engagement |
| NPS score | >40 | Would they recommend? |
| Feature requests | Collected | Roadmap input |

---

### Phase 3: Controlled Launch (Months 4-5)

**Objective:** Launch to waitlist, generate initial traction

#### 3.1 Launch Sequence

**Week -2: Teaser**
```
Email subject: "LogMyDose launches in 2 weeks"

You've been waiting. It's almost here.

In 2 weeks, you'll get access to:
- AI-powered peptide tracking
- Personalized insights based on YOUR data
- Progress tracking that actually makes sense

Watch your inbox on [DATE].

P.S. - First 100 users get 50% off the first year.
```

**Week -1: Early Access for Engaged**
- Open to beta users + most engaged waitlist (opened all emails)
- Soft launch to catch any issues

**Launch Day:**
```
Email subject: "LogMyDose is live. You're in."

It's here.

LogMyDose is now live, and as a waitlist member,
you get first access.

[Download on App Store]
[Open Web App]

Launch pricing (first 100 users only):
- 50% off your first year ($4.99/mo instead of $9.99)
- Lock in this rate forever if you subscribe in the first week

What's included:
- Unlimited dose logging
- AI insights and weekly reports
- Bloodwork tracking
- Progress photos
- Side effect correlation

I built this because I was tired of [personal story].
Now I want to see if it helps you too.

Reply to this email and tell me which peptides you're
tracking. I read every response.

- [Your name]
```

**Launch Week Activities:**
- [ ] Monitor app for bugs/issues
- [ ] Respond to every support email personally
- [ ] Post on personal Twitter about launch
- [ ] Do NOT post on Reddit (too promotional, will backfire)
- [ ] Email non-openers a reminder after 3 days

#### 3.2 Reddit Launch Strategy (Careful)

**What NOT to do:**
- Post "I built an app for peptides!" (will get downvoted/removed)
- Spam the link in comments
- Create fake accounts to promote

**What TO do:**
- Continue being helpful in comments
- When someone asks "how do you track your doses?" mention it naturally:
  ```
  "I use a combination of things. Actually just started
  using this app called LogMyDose - it's new but lets
  me track doses and see patterns in side effects.
  Before that I just used a spreadsheet."
  ```
- If someone asks for recommendations, mention it among other options
- Wait for organic questions about the app

**Timing:** Only start mentioning after 10-20 organic users have already discovered it

#### 3.3 Launch Metrics to Track

| Metric | Week 1 Target | Month 1 Target |
|--------|---------------|----------------|
| Downloads/Signups | 200 | 500 |
| Paid conversions | 20 | 75 |
| MRR | $100 | $400 |
| Day 7 retention | 35% | 40% |
| App Store rating | 4.5+ | 4.5+ |

---

### Phase 4: Growth & Community (Months 5-8)

**Objective:** Sustainable growth through community and content

#### 4.1 Content Amplification

Now that product exists, content becomes more valuable:

- [ ] YouTube: "How I Track My Peptide Protocol" (screen recordings)
- [ ] Podcast appearances: Reach out to biohacking/health podcasts
- [ ] Guest posts: Contribute to health optimization blogs
- [ ] SEO: Double down on what's ranking

#### 4.2 Community Building

**Option A: Discord Community**
- Free community for peptide users (not just LogMyDose users)
- Channels: #bpc-157, #semaglutide, #bloodwork, #general
- Moderate actively, keep signal high
- Becomes organic user acquisition channel

**Option B: Reddit Presence**
- Create r/logmydose for support/feedback
- Continue personal helpful presence in peptide subs
- Share anonymized insights: "Interesting data: 73% of our Sema users report reduced nausea after week 4"

#### 4.3 Referral Program

```
Give 1 month free, Get 1 month free

Share your link: logmydose.com/ref/[username]

When someone subscribes, you both get a free month.
```

Simple, viral loop for D2C growth.

#### 4.4 Influencer/KOL Strategy

**Micro-influencers (1k-50k followers):**
- Biohackers on Twitter/YouTube
- Peptide-focused content creators
- Fitness influencers who discuss PEDs openly

**Approach:**
- Offer free lifetime access
- No obligation to post (but they usually do if they like it)
- Provide good experience, let them discover value

**Target List:**
- [ ] Research 20 micro-influencers in peptide/biohacking space
- [ ] DM 10 with personalized outreach
- [ ] Goal: 3-5 organic mentions from influencers

---

### Phase 5: Clinic Partnerships (Months 6-9)

**Objective:** Add B2B revenue through clinic partnerships

#### 5.1 Clinic Outreach

**Target Clinics:**
- Telehealth peptide providers (many are small operations)
- HRT/TRT clinics that also offer peptides
- Wellness/longevity clinics
- Compounding pharmacies with clinic relationships

**Value Proposition:**
```
"Your patients are already tracking their protocols in
spreadsheets or not at all. LogMyDose gives them a
dedicated app - branded with your clinic's logo.

You get:
- Patient adherence dashboard
- Side effect reports without phone calls
- Progress tracking and bloodwork trends
- Reduced support burden

Patients get:
- Professional tracking app (not a spreadsheet)
- AI-powered insights on their protocol
- Easy logging and reminders

Pricing: $99/mo base + $3/active patient
Free pilot for first 2 clinics.
```

#### 5.2 Pilot Program

- Offer 2-3 clinics free 3-month pilot
- Gather case study data
- Testimonials for marketing
- Refine B2B features based on feedback

---

### Peptide-Specific Product Priorities

Features to prioritize for peptide users specifically:

#### Must Have for Launch (MVP)
- [ ] Peptide database (BPC-157, TB-500, Sema, Tirz, CJC, Ipamorelin, etc.)
- [ ] Reconstitution calculator (BAC water + peptide mg = concentration)
- [ ] Dose logging with injection site tracking (body diagram)
- [ ] Side effect logging with severity
- [ ] Basic protocol templates (dosing schedules)
- [ ] Storage/expiration reminders
- [ ] AI: Weekly summary report

#### High Priority (Fast Follow)
- [ ] Titration schedule tracking (especially for Sema/Tirz)
- [ ] Cycle tracking (on/off weeks for cycling peptides)
- [ ] Bloodwork photo upload + manual entry
- [ ] AI: Annotations on dose logs
- [ ] AI: Insight cards (pattern detection)
- [ ] Progress photos with timeline view

#### Nice to Have (Later)
- [ ] AI: Bloodwork interpretation
- [ ] Supplier/batch tracking (controversial but requested)
- [ ] Community features (anonymous protocol sharing)
- [ ] Apple Health integration

---

### Key Messaging & Positioning

#### Tagline Options
- "Track Your Protocol. Optimize Your Results."
- "Peptide tracking that actually helps."
- "Your protocol, intelligently tracked."
- "Stop guessing. Start knowing."

#### Key Messages by Segment

**Self-Optimizers:**
> "You research everything before you inject it.
> Why track it in a spreadsheet? LogMyDose shows you
> patterns you'd never notice on your own."

**Semaglutide Users:**
> "Titration schedules, side effect patterns, weight
> trends - all in one place. Know if it's working
> without guessing."

**Clinic Patients:**
> "Your clinic prescribed the protocol. LogMyDose
> helps you follow it perfectly and share progress
> with your provider."

**Newcomers:**
> "Starting peptides is overwhelming. LogMyDose
> guides you through your first protocol with
> reminders, tips, and safety alerts."

---

### Budget Allocation (If Applicable)

| Category | Budget | Notes |
|----------|--------|-------|
| Domain + Hosting | $20/mo | Vercel, Supabase free tiers |
| Email tool | $0-29/mo | ConvertKit free tier, then paid |
| App Store fees | $99/year | Apple Developer Program |
| Content (optional) | $0-500 | Could outsource some writing |
| Influencer gifts | $0 | Free access, no payment |
| **Total Pre-Launch** | **<$500** | Lean operation |

---

### Success Metrics (6-Month Targets)

| Metric | Target |
|--------|--------|
| Waitlist signups | 1,000+ |
| Launch week downloads | 200+ |
| Month 1 MRR | $400+ |
| Month 6 MRR | $2,000+ |
| Paid subscribers | 300+ |
| App Store rating | 4.5+ stars |
| Clinic pilots | 2-3 |
| Reddit mentions (organic) | 20+ |

---

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **FDA/Legal concerns** | Clear disclaimers, no medical advice, user-controlled data |
| **Reddit backlash** | Never self-promote, only help genuinely, let others mention |
| **Low waitlist signups** | Double down on content, adjust messaging, consider paid ads |
| **Poor retention** | Focus on AI value, rapid iteration based on feedback |
| **Clinic rejection** | Start with smaller/newer clinics, offer free pilots |

---

## 1. Product Model: D2C + B2B Hybrid

### User Paths

**Path 1: Direct User (D2C)**
```
User signs up → Selects peptides from template library → App generates protocol
→ User tracks doses, side effects, progress → Self-manages entirely
```
- No clinic involvement
- Uses pre-built protocol templates
- Can customize dosing within template guidelines
- Pays subscription directly to platform

**Path 2: Clinic-Managed User (B2B)**
```
Clinic invites patient OR patient links to clinic → Clinic can view/modify protocol
→ Patient tracks doses → Clinic monitors and optimizes → Hybrid control
```
- Clinic can override/customize protocols
- Patient can still self-manage within clinic's bounds
- Clinic sees patient dashboard, logs, progress
- Clinic pays for platform access

**Path 3: Upgrade Path**
```
D2C user → Finds a clinic on platform → Links account → Becomes clinic-managed
```

### Key Differences by User Type

| Feature | D2C User | Clinic-Managed |
|---------|----------|----------------|
| Protocol source | Templates | Clinic or templates |
| Dosing control | Full self-control | Clinic can set limits |
| Progress sharing | Private | Shared with clinic |
| Bloodwork review | Self-interpretation | Clinic reviews |
| Billing | Direct subscription | Via clinic or direct |
| App branding | Platform brand | Clinic's white-label |

### HIPAA Considerations

**D2C (Self-Tracking):**
- Personal health tracking (like Apple Health) - lighter compliance burden
- User owns their data, no covered entity involved
- Still implement security best practices
- Terms of Service: "not medical advice, consult physician"

**Clinic-Managed:**
- Full HIPAA compliance required
- BAAs with all vendors
- Clinic is the covered entity
- Platform is business associate

---

## 1. AI Strategy & Architecture

AI is the core differentiator - not a feature, but the foundation of the user experience. The app embodies **ambient intelligence**: AI that works continuously in the background, surfacing insights proactively without requiring user prompts or chat interfaces.

### Design Philosophy

**"AI that works for you, not AI you work with"**

- Users never need to ask questions or prompt the AI
- AI observes, analyzes, and surfaces what matters
- Interface feels intelligent, not like a chatbot bolted on
- Value is delivered continuously, not on-demand

### AI Interface Components

#### 1. Proactive Insight Cards

AI-generated cards appear in a feed, surfacing personalized insights based on user data patterns.

**Examples:**
```
┌─────────────────────────────────────┐
│ 💡 PATTERN DETECTED                 │
│ Your nausea correlates with morning │
│ doses. Evening users report 40%     │
│ fewer side effects with Semaglutide │
│                                     │
│ [Adjust Schedule]      [Dismiss]    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📈 PROGRESS UPDATE                  │
│ Week 4 complete. Your weight loss   │
│ trajectory matches top 25% of users │
│ on this protocol. Stay consistent.  │
│                                     │
│ [View Details]         [Dismiss]    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ⚠️ ATTENTION                        │
│ Your BPC-157 was reconstituted 27   │
│ days ago. Potency decreases after   │
│ 28 days. Consider ordering refill.  │
│                                     │
│ [Set Reminder]         [Dismiss]    │
└─────────────────────────────────────┘
```

**Insight Categories:**
- Pattern detection (correlations in user data)
- Progress updates (trajectory analysis)
- Optimization suggestions (dosing, timing, protocol tweaks)
- Safety alerts (interactions, concerning patterns)
- Milestone celebrations (adherence streaks, goals)
- Educational moments (contextual learning)

#### 2. AI Annotations on Data

AI adds inline context directly on logs, bloodwork, and progress entries - not in a separate place.

**Examples:**
```
DOSE LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Jan 10, 8:30 AM • BPC-157 250mcg ✓
   └─ AI: "Week 3 at maintenance dose. Most users
          report noticeable effects by week 4-6."

Jan 9, 8:45 AM • BPC-157 250mcg ✓
   └─ AI: "Consistent timing. This helps maintain
          stable peptide levels."

Jan 8, 10:15 AM • BPC-157 250mcg ✓
   └─ AI: "Later than usual (avg: 8:32 AM).
          Consistency improves outcomes."
```

```
BLOODWORK RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IGF-1: 287 ng/mL                    ↑
   └─ AI: "Up 23% since starting protocol.
          Optimal range for your goals: 250-350.
          You're in the sweet spot."

Fasting Glucose: 95 mg/dL           →
   └─ AI: "Stable. Semaglutide typically shows
          glucose improvements by week 6-8."

HbA1c: 5.4%                         ↓
   └─ AI: "Down from 5.7%. Excellent response
          to protocol. Below pre-diabetic range."
```

#### 3. AI-Generated Periodic Reports

Weekly and monthly narrative summaries written by AI - actual analysis, not just charts.

**Weekly Report Example:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WEEK 4 SUMMARY
Generated Jan 10, 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ADHERENCE: 94% (13/14 doses)
The two missed doses were both on travel days
(Jan 5-6). Consider setting a travel-specific
reminder or packing doses in carry-on.

SIDE EFFECTS: Improving
Nausea frequency decreased from 4 episodes (week 2)
to 1 episode this week. This follows the typical
adaptation curve for Semaglutide.

INJECTION SITES: Needs attention
You've favored left abdomen (8 of last 10 doses).
Rotating sites prevents lipohypertrophy. Try right
thigh or right abdomen this week.

PROGRESS: On track
Weight: -4.2 lbs since start (1.05 lbs/week)
This is within expected range. Typical trajectory
suggests 8-12 lbs total by week 8.

LOOKING AHEAD
Week 5 is when many users consider titrating up.
Your current response is strong - maintaining dose
may be optimal. Discuss with your provider if
clinic-managed.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Monthly Report includes:**
- Comprehensive progress analysis
- Bloodwork trend interpretation
- Protocol effectiveness scoring
- Recommendations for next month
- Comparative benchmarks (anonymized)

#### 4. Contextual Decision Support

AI appears at decision points - when the user is about to take an action.

**Examples:**

*Before logging a dose:*
```
┌─────────────────────────────────────┐
│ ⚠️ BEFORE YOU LOG                   │
│                                     │
│ You reported headache 2 hours after │
│ your last dose. This is the 3rd     │
│ occurrence this week.               │
│                                     │
│ • Log dose normally                 │
│ • Reduce dose by 20% (200mcg)       │
│ • Skip and note reason              │
│ • Learn about this side effect      │
└─────────────────────────────────────┘
```

*When adjusting protocol:*
```
┌─────────────────────────────────────┐
│ 📊 DOSE CHANGE CONTEXT              │
│                                     │
│ Increasing from 250mcg → 500mcg     │
│                                     │
│ This is a 100% increase. Standard   │
│ titration is 25-50% increments.     │
│                                     │
│ Suggested alternative: 375mcg       │
│ (50% increase)                      │
│                                     │
│ • Proceed with 500mcg               │
│ • Use suggested 375mcg              │
│ • Cancel change                     │
└─────────────────────────────────────┘
```

*When uploading bloodwork:*
```
┌─────────────────────────────────────┐
│ 🔬 BLOODWORK TIMING                 │
│                                     │
│ For accurate GH-related markers,    │
│ blood should be drawn:              │
│ • Fasted (8+ hours)                 │
│ • Before morning dose               │
│ • Same time as previous draws       │
│                                     │
│ Was this draw fasted?               │
│ [Yes, fasted]  [No]  [Not sure]     │
└─────────────────────────────────────┘
```

#### 5. Smart Highlights / Ambient UI

The interface itself adapts based on AI analysis - no explicit AI "feature," just an intelligent UI.

**Behaviors:**
- **Priority surfacing**: Important metrics move to top of dashboard
- **Anomaly highlighting**: Unusual values get visual emphasis (glow, color)
- **Relevance fading**: Less relevant data recedes visually
- **Dynamic grouping**: Related items cluster when AI detects connection
- **Attention indicators**: Subtle badges on items needing review

**Example Dashboard Adaptation:**
```
NORMAL STATE:
┌─────────────────────────────────────┐
│ Today's Doses    Progress    Labs   │
└─────────────────────────────────────┘

WHEN BLOODWORK UPLOADED:
┌─────────────────────────────────────┐
│ Labs (NEW) ●     Today's    Progress│
│                  Doses              │
└─────────────────────────────────────┘
Labs section pulses subtly, moves to front

WHEN DOSE OVERDUE:
┌─────────────────────────────────────┐
│ ⚠️ Dose Due      Labs       Progress│
│ BPC-157 250mcg                      │
│ [Log Now]                           │
└─────────────────────────────────────┘
Overdue dose becomes prominent card
```

#### 6. AI-Powered "Why" Layer

Tap any data point to get AI-generated context and explanation.

**Examples:**

*Tap on weight graph:*
```
┌─────────────────────────────────────┐
│ WHY THIS MATTERS                    │
│                                     │
│ You've lost 4.2 lbs in 3 weeks.     │
│                                     │
│ • This is within expected range for │
│   Semaglutide at 0.5mg/week         │
│ • Rate: 1.4 lbs/week (healthy)      │
│ • Typical trajectory: 8-12 lbs by   │
│   week 8                            │
│ • Your rate is faster than 65% of   │
│   users on similar protocols        │
│                                     │
│ Recommendation: Maintain current    │
│ dose. No adjustment needed.         │
└─────────────────────────────────────┘
```

*Tap on a peptide in protocol:*
```
┌─────────────────────────────────────┐
│ BPC-157 • Body Protection Compound  │
│                                     │
│ WHY IT'S IN YOUR PROTOCOL           │
│ Selected for: Gut health, tissue    │
│ repair, inflammation reduction      │
│                                     │
│ YOUR STATS                          │
│ • 28 days on protocol               │
│ • 94% adherence                     │
│ • 2 side effects reported (mild)    │
│                                     │
│ TYPICAL TIMELINE                    │
│ Weeks 1-2: Building in system       │
│ Weeks 3-4: ← You are here           │
│ Weeks 5-8: Most users notice effects│
│                                     │
│ [View Full Info]  [See Research]    │
└─────────────────────────────────────┘
```

### AI Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                    AI LAYER                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────┐    ┌───────────────────────┐    │
│  │ LLM Provider  │    │ Knowledge Base (RAG)  │    │
│  │ Anthropic/    │◄──►│ • Peptide research    │    │
│  │ OpenAI API    │    │ • Protocol templates  │    │
│  │               │    │ • Side effect data    │    │
│  └───────┬───────┘    │ • Dosing guidelines   │    │
│          │            │ • User outcome data   │    │
│          │            └───────────────────────┘    │
│          ▼                                         │
│  ┌───────────────────────────────────────────┐    │
│  │           Prompt Engineering Layer         │    │
│  │  • Insight generation prompts              │    │
│  │  • Annotation prompts                      │    │
│  │  • Report generation prompts               │    │
│  │  • Safety rails & medical disclaimers      │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                 PROCESSING LAYER                    │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Insight    │  │  Annotation │  │   Report    │ │
│  │  Generator  │  │  Engine     │  │  Generator  │ │
│  │  (async)    │  │  (on-read)  │  │  (scheduled)│ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Decision   │  │    UI       │  │    Why      │ │
│  │  Support    │  │  Adapter    │  │   Layer     │ │
│  │  (on-action)│  │  (realtime) │  │  (on-tap)   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   DATA LAYER                        │
├─────────────────────────────────────────────────────┤
│  User doses, side effects, progress, bloodwork,    │
│  protocol history, preferences, anonymized         │
│  aggregate outcomes from all users                 │
└─────────────────────────────────────────────────────┘
```

### AI Data Pipeline

**Input Sources:**
- Dose logs (timing, amounts, sites, notes)
- Side effect reports (symptoms, severity, duration)
- Progress entries (photos, measurements, bloodwork)
- Protocol details (substances, doses, schedules)
- User profile (goals, experience level, health history)
- Aggregate anonymized data (population benchmarks)

**Processing Triggers:**

| Component | Trigger | Latency |
|-----------|---------|---------|
| Insight Cards | Background job (hourly/daily) | Async |
| Annotations | When data is viewed | <500ms |
| Reports | Scheduled (weekly/monthly) | Async |
| Decision Support | Before user action | <300ms |
| Smart UI | On dashboard load | <200ms |
| Why Layer | On user tap | <500ms |

**Output Storage:**
```sql
-- Pre-generated insights for fast retrieval
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  type VARCHAR(50),  -- 'pattern', 'progress', 'alert', 'optimization'
  title VARCHAR(255),
  content TEXT,
  actions JSONB,  -- available actions user can take
  priority INTEGER,  -- for sorting/surfacing
  context_data JSONB,  -- data that generated this insight
  expires_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  acted_on_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cached annotations for viewed data
CREATE TABLE ai_annotations (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  entity_type VARCHAR(50),  -- 'dose', 'bloodwork', 'progress'
  entity_id UUID,
  annotation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated reports
CREATE TABLE ai_reports (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  type VARCHAR(50),  -- 'weekly', 'monthly'
  period_start DATE,
  period_end DATE,
  content TEXT,
  sections JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Safety & Compliance

**Medical Disclaimer Framework:**
- All AI outputs include subtle but clear "AI-generated" indicator
- Insights that could be interpreted as medical advice include disclaimer
- Escalation triggers for concerning patterns (notify clinic if linked)
- AI cannot recommend starting/stopping substances
- AI cannot diagnose conditions
- Clear language: "Based on your data..." not "You should..."

**Escalation Triggers:**
- Severe side effect reported → Alert clinic (if linked) + suggest contacting provider
- Dangerous interaction detected → Prominent warning + block action
- Pattern suggesting misuse → Flag for review
- User reports emergency symptoms → Direct to emergency services

**Prompt Engineering Safety:**
```
System prompt includes:
- "You are a health tracking assistant, not a medical provider"
- "Never diagnose or recommend starting/stopping medications"
- "Always suggest consulting healthcare provider for medical decisions"
- "Flag concerning patterns but do not cause alarm"
- "Use language like 'your data suggests' not 'you have' or 'you should'"
```

### AI Feature Rollout

**Phase 1 (MVP):**
- Basic insight cards (rule-based + simple LLM)
- Annotations on dose logs
- Weekly summary reports

**Phase 2:**
- Bloodwork interpretation
- Decision support on dose logging
- Smart UI highlighting

**Phase 3:**
- Why layer (tap-to-explain)
- Progress photo analysis
- Comparative benchmarks

**Phase 4:**
- Predictive analytics
- Personalized protocol optimization suggestions
- Clinic-facing AI insights dashboard

### Competitive Moat

Over time, the platform builds defensible advantages:

1. **Proprietary outcome data**: Anonymized data on what protocols work for which user profiles
2. **Fine-tuned models**: Models trained on real peptide therapy outcomes
3. **Insight library**: Pre-computed insights based on pattern recognition
4. **User feedback loop**: Dismissed vs acted-upon insights improve relevance

---

## 2. HIPAA Compliance Architecture

### Requirements
HIPAA applies because the app handles Protected Health Information (PHI): patient names, health data, bloodwork, photos, treatment protocols.

### HIPAA Compliance Path with Vercel + PostgreSQL

**Development: Local Docker PostgreSQL**
- Docker Compose for local PostgreSQL instance
- Prisma ORM for database access and migrations
- No cloud costs during development
- Easy to reset/seed data for testing

**Production: Supabase (Recommended)**
- HIPAA compliant on Pro+ plans with signed BAA
- Includes PostgreSQL + Auth + Storage + Realtime
- Built-in Row Level Security support
- Edge Functions for serverless compute
- S3-compatible storage included (no separate provider needed)

**Production Alternative: AWS RDS PostgreSQL**
- Sign AWS BAA (covers RDS, S3, etc.)
- More ops overhead but maximum control
- Use if Supabase doesn't meet specific requirements

### 1. Business Associate Agreements (BAAs)
Required BAAs before storing PHI:
- **Database:** Supabase (Pro+ plan) or AWS (if using RDS)
- **File Storage:** AWS S3, Cloudflare R2, or Supabase Storage
- **Hosting:** Vercel offers HIPAA compliance on Enterprise plan
  - Alternative: Self-host on AWS/GCP with their BAAs

### 2. Data Security

**Database Level:**
- Row-Level Security (RLS) for tenant isolation
- All queries scoped by `tenant_id`
- Encrypted connections (SSL required)
- Regular backups with encryption

**Application Level:**
- Input validation on all endpoints
- Parameterized queries (prevent SQL injection)
- Field-level encryption for sensitive data (SSN, detailed health records)

### 3. Data Encryption
- At rest: Database encryption (AES-256)
- In transit: TLS 1.3 enforced
- Consider application-layer encryption for highly sensitive fields

### 4. Access Controls
- Role-based access: Super Admin, Clinic Admin, Provider, Patient
- JWT tokens with short expiration (15 min access, 7 day refresh)
- Minimum necessary access principle
- Session timeout: 15 minutes inactive

### 5. Audit Logging
- Log all data access and modifications
- Store: who, what, when, IP address, action
- Retain logs 6+ years
- Separate audit log table (immutable)

### 6. Additional Requirements
- Privacy Policy and Terms of Service (HIPAA-specific)
- Patient consent forms (digital signature)
- Data breach notification procedures (72-hour rule)
- Security incident response plan
- Regular security assessments

### Infrastructure Setup

**Local Development:**
```
Docker Compose
├── PostgreSQL 16 container
├── Volume for data persistence
├── Exposed on localhost:5432
└── pgAdmin (optional) for GUI access

Prisma ORM
├── Type-safe database client
├── Schema-first migrations
├── Seeding scripts
└── Studio for data browsing
```

**Production:**
```
Backend API (Railway/Render/Fly.io)
├── Express.js + TypeScript
├── REST API endpoints
├── JWT authentication
└── Background jobs (Bull/Agenda)

Web Portals (Vercel/Cloudflare Pages)
├── React + Vite (static builds)
├── Clinic Portal
├── Admin Portal
└── Patient Portal

PostgreSQL (Supabase)
├── All relational data
├── Row-level security policies
├── Encrypted at rest
├── Connection pooling
└── Built-in Auth & Storage

File Storage (S3/R2)
├── Progress photos
├── Bloodwork documents
├── Education videos
└── Clinic branding assets

Authentication
├── Custom JWT implementation
├── Access tokens (15 min) + Refresh tokens (7 days)
├── bcrypt password hashing
└── Secure HTTP-only cookies
```

---

## 2. System Architecture

### Data Model (PostgreSQL Schema)

```sql
-- Multi-tenancy: All tenant-scoped tables include tenant_id with RLS policies

-- Clinic/white-label instances
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,  -- for white-label URLs
  branding JSONB,  -- logo_url, primary_color, secondary_color, app_name
  subscription_tier VARCHAR(50),
  subscription_status VARCHAR(50),
  stripe_customer_id VARCHAR(255),
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (providers, admins, super admins)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) NOT NULL,  -- super_admin, clinic_admin, provider
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  credentials VARCHAR(255),  -- MD, DO, NP, etc.
  permissions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients/Users (unified table for D2C and clinic-managed)
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  phone VARCHAR(20),

  -- Account type
  account_type VARCHAR(50) DEFAULT 'd2c',  -- 'd2c' | 'clinic_managed' | 'hybrid'

  -- D2C subscription (when not clinic-managed)
  subscription_tier VARCHAR(50),  -- 'free' | 'pro'
  subscription_status VARCHAR(50),
  stripe_customer_id VARCHAR(255),

  -- Clinic link (optional - NULL for pure D2C users)
  clinic_id UUID REFERENCES tenants(id),  -- NULL = D2C user
  clinic_linked_at TIMESTAMPTZ,
  clinic_control_level VARCHAR(50),  -- 'view_only' | 'can_modify' | 'full_control'

  consent_signed_at TIMESTAMPTZ,
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinic invitations (for clinic to invite patients)
CREATE TABLE clinic_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES tenants(id) NOT NULL,
  email VARCHAR(255) NOT NULL,
  invite_code VARCHAR(50) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending',  -- 'pending' | 'accepted' | 'expired'
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Substance categories (extensible for future verticals)
CREATE TABLE substance_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,  -- 'peptide', 'hormone', 'supplement', 'nootropic', 'medication'
  display_name VARCHAR(100),
  description TEXT,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial categories
-- INSERT INTO substance_categories (name, display_name) VALUES
-- ('peptide', 'Peptides'),
-- ('hormone', 'Hormone Therapy'),
-- ('supplement', 'Supplements'),
-- ('nootropic', 'Nootropics'),
-- ('medication', 'Medications');

-- Substances database (generic - supports peptides, hormones, supplements, etc.)
CREATE TABLE substances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES substance_categories(id) NOT NULL,
  name VARCHAR(100) NOT NULL,
  aliases TEXT[],  -- alternative names
  subcategory VARCHAR(100),  -- e.g., 'healing', 'gh_secretagogue', 'vitamin', 'testosterone'

  -- Dosing info (flexible units)
  default_dose DECIMAL,
  dose_unit VARCHAR(20),  -- 'mcg', 'mg', 'ml', 'iu', 'capsule', etc.
  default_frequency VARCHAR(50),

  -- Administration
  administration_route VARCHAR(50),  -- 'injection_subq', 'injection_im', 'oral', 'topical', 'sublingual'
  preparation_instructions TEXT,  -- reconstitution for peptides, N/A for pills

  -- Storage
  storage_temp VARCHAR(50),
  storage_notes TEXT,
  shelf_life_days INTEGER,
  shelf_life_reconstituted_days INTEGER,  -- for peptides

  -- Cycling (optional - mainly for peptides/hormones)
  requires_cycling BOOLEAN DEFAULT false,
  common_cycle_on_weeks INTEGER,
  common_cycle_off_weeks INTEGER,

  -- Safety info
  contraindications TEXT[],
  common_side_effects TEXT[],
  interactions TEXT[],
  onset_timeline VARCHAR(100),

  -- Metadata
  is_prescription_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Protocol templates (public library)
CREATE TABLE protocol_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES substance_categories(id),  -- filter by category
  substance_id UUID REFERENCES substances(id),
  default_dose DECIMAL,
  dose_unit VARCHAR(20),
  frequency VARCHAR(50),
  titration_plan JSONB,
  cycle_on_weeks INTEGER,
  cycle_off_weeks INTEGER,
  difficulty_level VARCHAR(50),  -- 'beginner' | 'intermediate' | 'advanced'
  tags TEXT[],  -- 'weight_loss', 'muscle_gain', 'recovery', etc.
  use_count INTEGER DEFAULT 0,  -- popularity tracking
  is_public BOOLEAN DEFAULT true,
  created_by_clinic_id UUID REFERENCES tenants(id),  -- NULL = platform template
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient protocols (user's active protocols)
CREATE TABLE protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) NOT NULL,

  -- Source tracking
  source VARCHAR(50) NOT NULL,  -- 'template' | 'clinic_assigned' | 'custom'
  template_id UUID REFERENCES protocol_templates(id),

  -- Clinic management (optional)
  clinic_id UUID REFERENCES tenants(id),  -- NULL = self-managed
  provider_id UUID REFERENCES users(id),  -- Clinic provider who manages
  clinic_can_modify BOOLEAN DEFAULT false,

  status VARCHAR(50) DEFAULT 'active',  -- draft, active, paused, completed
  start_date DATE,
  end_date DATE,
  notes TEXT,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Protocol substances (many-to-many with dosing details)
CREATE TABLE protocol_substances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_id UUID REFERENCES protocols(id) NOT NULL,
  substance_id UUID REFERENCES substances(id) NOT NULL,
  dose DECIMAL NOT NULL,
  dose_unit VARCHAR(20),  -- 'mcg', 'mg', 'ml', 'iu', etc.
  frequency VARCHAR(50),  -- daily, 2x_daily, 3x_weekly, etc.
  schedule JSONB,  -- specific days/times
  titration_plan JSONB,  -- week-by-week dose changes
  cycle_on_weeks INTEGER,
  cycle_off_weeks INTEGER,

  -- Inventory tracking (optional)
  current_supply_amount DECIMAL,
  supply_unit VARCHAR(20),
  supply_expiration_date DATE,

  notes TEXT
);

-- Dose logs
CREATE TABLE doses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  protocol_substance_id UUID REFERENCES protocol_substances(id),
  substance_id UUID REFERENCES substances(id) NOT NULL,
  dose DECIMAL NOT NULL,
  dose_unit VARCHAR(20),
  scheduled_at TIMESTAMPTZ,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'taken',  -- taken, missed, skipped
  administration_site VARCHAR(50),  -- injection site, or N/A for oral
  notes TEXT,
  photo_url VARCHAR(500)
);

-- Side effects
CREATE TABLE side_effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  dose_id UUID REFERENCES doses(id),
  substance_id UUID REFERENCES substances(id),
  symptom VARCHAR(100) NOT NULL,
  severity INTEGER CHECK (severity BETWEEN 1 AND 10),
  duration_hours DECIMAL,  -- how long the side effect lasted
  notes TEXT,
  reported_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress entries (photos, bloodwork, measurements)
CREATE TABLE progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  type VARCHAR(50) NOT NULL,  -- photo, bloodwork, measurement
  data JSONB,  -- flexible storage for different types
  file_urls TEXT[],
  notes TEXT,
  shared_with_clinic BOOLEAN DEFAULT false,  -- D2C users control sharing
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts (refills, expirations, reminders)
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  type VARCHAR(50) NOT NULL,  -- refill, expiration, storage, dose_reminder
  title VARCHAR(255),
  message TEXT,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'pending'
);

-- Education content
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,  -- video, article, guide
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_url VARCHAR(500),  -- for videos
  content_body TEXT,  -- for articles
  thumbnail_url VARCHAR(500),
  tags TEXT[],
  category_ids UUID[],  -- related substance categories
  substance_ids UUID[],  -- related substances
  is_global BOOLEAN DEFAULT false,  -- available to all tenants
  tenant_ids UUID[],  -- specific tenant access
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log (immutable)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  user_id UUID,
  patient_id UUID,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security example
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON patients
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

### API Structure (Express REST API)

```
/api/v1
├── /auth
│   ├── POST /register          # Patient/provider registration
│   ├── POST /login             # JWT token issuance
│   ├── POST /refresh           # Token refresh
│   ├── POST /forgot-password   # Password reset flow
│   └── POST /logout            # Token invalidation
├── /patients
│   ├── GET /me                 # Current patient profile
│   ├── PUT /me                 # Update profile
│   ├── GET /protocols          # Patient's protocols
│   ├── GET /doses              # Dose history
│   ├── POST /doses             # Log a dose
│   ├── POST /side-effects      # Report side effect
│   ├── GET /progress           # Progress entries
│   ├── POST /progress          # Upload progress (photo/bloodwork)
│   └── GET /alerts             # Patient alerts
├── /protocols
│   ├── POST /generate          # AI-assisted protocol generation
│   ├── GET /:id                # Protocol details
│   ├── PUT /:id/approve        # Provider approval
│   ├── GET /:id/schedule       # Calculated dose schedule
│   └── PUT /:id/status         # Update protocol status
├── /providers
│   ├── GET /patients           # Provider's patient list
│   ├── GET /patients/:id       # Patient detail view
│   ├── GET /patients/:id/dashboard  # Patient dashboard data
│   ├── PUT /patients/:id/protocol   # Modify protocol
│   └── GET /approvals          # Pending approvals queue
├── /tenants
│   ├── GET /me                 # Current tenant info
│   ├── PUT /me                 # Update tenant settings
│   ├── PUT /branding           # Update white-label branding
│   └── GET /analytics          # Tenant analytics
├── /admin (super admin only)
│   ├── GET /tenants            # All tenants
│   ├── POST /tenants           # Create tenant
│   ├── PUT /tenants/:id        # Update tenant
│   ├── GET /analytics          # Platform analytics
│   └── GET /audit-logs         # System audit logs
├── /substances
│   ├── GET /                   # List all substances (filter by category)
│   ├── GET /categories         # List substance categories
│   ├── GET /:id                # Substance details
│   └── POST / (admin)          # Add new substance
├── /templates
│   ├── GET /                   # List protocol templates (filter by category/substance)
│   ├── GET /:id                # Template details
│   └── POST / (admin/clinic)   # Create template
├── /content
│   ├── GET /                   # Education content list
│   ├── GET /:id                # Content detail
│   └── POST / (admin/clinic)   # Create content
└── /billing
    ├── POST /subscribe         # Create subscription
    ├── POST /webhook           # Stripe webhook handler
    ├── GET /invoices           # Invoice history
    └── POST /portal            # Stripe customer portal link
```

### Tech Stack Details

```
Backend (Express.js)
├── Express.js 4.x
├── TypeScript
├── REST API
├── Prisma ORM (PostgreSQL)
├── Zod (request validation)
├── JWT (jsonwebtoken)
├── Helmet (security headers)
├── express-rate-limit
└── cors

Database
├── PostgreSQL (Supabase for production)
├── Docker PostgreSQL for local development
├── Prisma for migrations & queries
├── Connection pooling (Supabase built-in)
└── Row Level Security

File Storage
├── Supabase Storage (production) or local MinIO (development)
├── Pre-signed URLs for uploads
├── multer (file upload handling)
└── CDN for delivery (Supabase CDN or CloudFront/Cloudflare)

Authentication
├── Custom JWT implementation
├── bcrypt (password hashing)
├── Refresh token rotation
└── HTTP-only secure cookies

Hosting
├── Backend: Railway, Render, or Fly.io
├── Web Apps: Vercel or Cloudflare Pages
└── Alternatively: Single VPS (DigitalOcean/Hetzner)

iOS App
├── Swift 5.9+
├── SwiftUI
├── Combine/async-await
├── KeychainSwift (secure storage)
└── URLSession (networking)

Web Portals (React + Vite)
├── React 18+
├── Vite (build tool)
├── TailwindCSS
├── React Query (data fetching)
├── React Router v6
└── React Hook Form + Zod
```

---

## 3. Feature Breakdown by Component

### 3.1 iOS App (Swift/SwiftUI)

**Onboarding (D2C Flow)**
- [ ] App-branded splash/login
- [ ] Email/password registration (or Apple Sign-In)
- [ ] Onboarding quiz: goals, experience level, peptides interested in
- [ ] Browse protocol templates by category/peptide
- [ ] Select template → customize dosing → start protocol

**Onboarding (Clinic Link - Optional)**
- [ ] "Link to Clinic" option in settings
- [ ] Enter clinic invite code OR search for clinic
- [ ] Consent to share data with clinic
- [ ] Clinic branding replaces app branding

**Dashboard**
- [ ] Active compounds display with visual cards
- [ ] Today's doses with check-off
- [ ] Cycle progress ring (days remaining)
- [ ] Next refill date with auto-calculation
- [ ] Quick-action buttons (log dose, report side effect)

**Protocol Management**
- [ ] Full protocol view (dosage, schedule, titration plan)
- [ ] Calendar view of upcoming doses
- [ ] Dose reminders (local notifications)
- [ ] Storage reminders (refrigeration alerts)
- [ ] Expiration tracking per vial

**Dose Logging**
- [ ] One-tap dose confirmation
- [ ] Injection site rotation tracker (body diagram)
- [ ] Side effect logging (severity scale, notes)
- [ ] Missed dose handling
- [ ] Photo attachment option

**Progress Tracking**
- [ ] Progress photo capture (before/after grid)
- [ ] Bloodwork upload (camera + manual entry)
- [ ] Measurements logging (weight, body comp)
- [ ] Symptom/wellness journal
- [ ] Charts/trends visualization

**Education Library**
- [ ] Video player for clinic content
- [ ] Article/guide reader
- [ ] Peptide-specific information
- [ ] Storage and handling guides
- [ ] FAQ section

**Settings**
- [ ] Profile management
- [ ] Notification preferences
- [ ] Clinic contact info
- [ ] Data export (HIPAA right of access)
- [ ] Account deletion

### 3.2 Clinic Web Portal (React)

**Dashboard**
- [ ] Patient overview (active, pending, inactive)
- [ ] Alerts requiring attention
- [ ] Protocol approvals queue
- [ ] Revenue metrics
- [ ] Compliance status

**Patient Management**
- [ ] Patient list with search/filter
- [ ] Individual patient detail view
- [ ] Protocol history and modifications
- [ ] Dose adherence analytics
- [ ] Side effect reports
- [ ] Progress photos/bloodwork review
- [ ] Secure messaging

**Protocol Builder**
- [ ] Peptide selection from master list
- [ ] Dosage configuration
- [ ] Titration schedule builder
- [ ] Cycling plan configuration
- [ ] Template save/reuse
- [ ] AI-assisted suggestions

**Inventory/Refills**
- [ ] Patient refill predictions
- [ ] Low stock alerts
- [ ] Order integration (future: connect to pharmacies)

**Content Management**
- [ ] Upload/manage education videos
- [ ] Create/edit guides
- [ ] Control content visibility

**Settings**
- [ ] White-label branding (logo, colors, app name)
- [ ] Provider management
- [ ] Notification settings
- [ ] Billing/subscription

### 3.3 Super Admin Portal (React)

**Tenant Management**
- [ ] Create/manage clinic tenants
- [ ] Subscription management
- [ ] Usage analytics per tenant
- [ ] Feature flags per tenant

**Global Content**
- [ ] Master peptide database
- [ ] Default protocol templates
- [ ] Shared education content

**Billing Administration**
- [ ] Stripe dashboard integration
- [ ] Revenue reporting
- [ ] Invoice management

**System Health**
- [ ] Error monitoring
- [ ] Usage metrics
- [ ] Security audit logs

### 3.4 Patient Web App (React)

Mirrors iOS app functionality for desktop access:
- [ ] Dashboard view
- [ ] Dose logging
- [ ] Progress upload
- [ ] Education library
- [ ] Profile/settings

---

## 4. Third-Party Integrations

| Integration | Purpose | Priority |
|-------------|---------|----------|
| Stripe | Subscription billing, patient payments | P0 |
| Supabase | Managed PostgreSQL + Auth + Storage with HIPAA compliance | P0 |
| Docker PostgreSQL | Local development database | P0 |
| Railway / Render | Express.js API hosting | P0 |
| **Anthropic Claude API** | **Primary LLM for AI features (insights, annotations, reports)** | **P0** |
| **OpenAI API** | **Backup LLM + embeddings for RAG knowledge base** | **P1** |
| **Pinecone / pgvector** | **Vector database for RAG (peptide research, protocols)** | **P1** |
| Resend / SendGrid | Transactional emails | P1 |
| node-cron / Bull | Scheduled jobs (alerts, reminders, AI batch processing) | P1 |
| Twilio | SMS reminders (optional) | P2 |
| Apple Health | Sync weight/measurements (iOS) | P2 |
| Sentry | Error tracking and monitoring | P2 |
| Lab APIs | Direct bloodwork import (future) | P3 |

---

## 5. Recommended Build Order (9-12 Months)

### Phase 1: Foundation (Months 1-2)
1. Set up Docker Compose with PostgreSQL 16 for local development
2. Initialize Express.js project with TypeScript
3. Configure Prisma ORM, create schema (including AI tables), run migrations
4. Set up S3/R2 for file storage with pre-signed URLs (or local MinIO for dev)
5. Implement JWT authentication (access + refresh tokens)
6. Build core API routes with validation (Zod)
7. Seed initial peptide database (see Section 5.1)
8. Set up audit logging middleware
9. **Set up AI infrastructure: Anthropic client, prompt templates, basic caching**
10. **Build RAG knowledge base: ingest peptide research, dosing guidelines**
11. Deploy API to Railway/Render (with Supabase PostgreSQL for production)

### Phase 2: Clinic Portal MVP (Months 2-3)
1. React project setup with TypeScript
2. Authentication/authorization
3. Patient list and detail views
4. Basic protocol builder
5. White-label theming system

### Phase 3: iOS App MVP (Months 4-5)
1. Swift/SwiftUI project setup
2. White-label theming infrastructure
3. Onboarding flow
4. Dashboard
5. Protocol view and dose logging
6. Push notifications

### Phase 4: Core Features + AI MVP (Months 6-7)
1. Progress photo/bloodwork upload
2. Side effect tracking
3. Education library (both platforms)
4. Protocol approval workflow
5. Refill calculations and alerts
6. **AI: Proactive Insight Cards (pattern detection, progress updates)**
7. **AI: Dose log annotations**
8. **AI: Weekly summary reports (scheduled job)**

### Phase 5: Billing & Admin + AI Enhancement (Months 8-9)
1. Stripe integration (clinic subscriptions)
2. Patient billing (if applicable)
3. Super admin portal
4. Patient web app
5. Analytics dashboards
6. **AI: Bloodwork interpretation and annotations**
7. **AI: Contextual decision support (pre-action prompts)**
8. **AI: Smart UI highlighting system**

### Phase 6: Launch Prep + AI Polish (Months 10-11)
1. Security audit
2. Performance optimization
3. App Store submission
4. Documentation
5. Clinic onboarding materials
6. **AI: "Why" layer (tap-to-explain)**
7. **AI: Monthly comprehensive reports**
8. **AI: Safety rails and escalation triggers testing**

### Phase 7: Post-Launch & Android (Month 12+)
1. Bug fixes and user feedback iteration
2. Android app development begins
3. Clinic partnership expansion
4. Feature enhancements based on real usage
5. **AI: Comparative benchmarks (anonymized population data)**
6. **AI: Predictive analytics and protocol optimization suggestions**
7. **AI: Clinic-facing AI insights dashboard**

### 5.1 Launch Substance Database

**Phase 1: Peptides (Launch)**

| Substance | Subcategory | Common Use | Route |
|-----------|-------------|------------|-------|
| BPC-157 | Healing | Tissue repair, gut health | SubQ |
| TB-500 | Healing | Injury recovery, inflammation | SubQ |
| CJC-1295 | GH Secretagogue | Growth hormone support | SubQ |
| Ipamorelin | GH Secretagogue | Growth hormone support | SubQ |
| Semaglutide | GLP-1 | Weight management | SubQ |
| Tirzepatide | GLP-1/GIP | Weight management | SubQ |
| PT-141 | Sexual Health | Libido enhancement | SubQ |
| Sermorelin | GHRH | Growth hormone support | SubQ |
| Tesamorelin | GHRH | Visceral fat reduction | SubQ |
| AOD-9604 | Metabolic | Fat metabolism | SubQ |
| GHK-Cu | Skin/Healing | Skin rejuvenation | SubQ/Topical |
| NAD+ | Longevity | Cellular energy | SubQ/IV |

**Phase 2: Hormones (Future)**
- Testosterone (various esters)
- Estrogen/Progesterone
- Thyroid (T3/T4)
- HCG
- Pregnenolone/DHEA

**Phase 3: Supplements (Future)**
- Vitamin D3
- B12 (injectable)
- Glutathione
- Magnesium varieties
- Popular nootropics

**Substance Data Fields:**
- Name, aliases, category, subcategory
- Default dose, unit, frequency
- Administration route (SubQ, IM, oral, topical, sublingual)
- Preparation instructions (reconstitution for peptides)
- Storage requirements
- Shelf life (raw and reconstituted)
- Cycling requirements (on/off weeks)
- Contraindications, side effects, interactions
- Onset timeline
- Prescription required flag

**Expansion Strategy:**
- User requests via app feedback
- Clinic requests for their patient base
- Data-driven: track what users manually add
- Medical advisor validation before adding

---

## 6. Billing Implementation

### Clinic Subscription Tiers

```typescript
const PRICING_TIERS = {
  starter: {
    basePrice: 149,
    includedPatients: 50,
    perPatientOverage: 3,
  },
  professional: {
    basePrice: 249,
    includedPatients: 100,
    perPatientOverage: 4,
  },
  enterprise: {
    basePrice: 399,
    includedPatients: 200,
    perPatientOverage: 5,
  },
};

// Monthly billing calculation
function calculateMonthlyBill(tier, activePatients) {
  const config = PRICING_TIERS[tier];
  const overage = Math.max(0, activePatients - config.includedPatients);
  const patientBilling = activePatients * config.perPatientOverage;

  // Charge whichever is higher
  return Math.max(config.basePrice, patientBilling);
}
```

### Stripe Setup
- Products for each tier
- Metered billing for patient counts
- Webhook handlers for subscription events
- Customer portal for self-service

---

## 7. Security Checklist

- [ ] BAA signed with Supabase (covers database + storage)
- [ ] BAA signed with API hosting provider (Railway/Render)
- [ ] Row Level Security policies tested
- [ ] API rate limiting implemented (express-rate-limit)
- [ ] Input validation on all endpoints (Zod schemas)
- [ ] SQL injection prevention (Prisma parameterized queries)
- [ ] XSS prevention in React apps (escape user content)
- [ ] CORS properly configured (whitelist origins)
- [ ] Helmet.js security headers enabled
- [ ] CSRF protection (SameSite cookies, CSRF tokens)
- [ ] Secure session management (httpOnly, secure cookies)
- [ ] Password requirements (12+ chars, bcrypt hashing)
- [ ] 2FA option for providers (TOTP)
- [ ] Audit logging active and tested
- [ ] Encryption at rest verified (database + storage)
- [ ] TLS 1.3 enforced everywhere
- [ ] Penetration testing before launch
- [ ] HIPAA risk assessment documented
- [ ] Dependency vulnerability scanning (npm audit, Snyk)

---

## 8. Acquisition Positioning

To maximize acquisition value for telehealth platforms:

**Key Metrics to Track**
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate
- Patient engagement (doses logged, adherence rate)
- Net Promoter Score (NPS)

**Differentiators to Build**
- Protocol efficacy data (anonymized outcomes)
- Adherence benchmarks
- Integration APIs for easy platform connection
- White-label flexibility
- HIPAA compliance documentation

**Target Acquisition Metrics**
- 50+ active clinic customers
- $50k+ MRR
- <5% monthly churn
- Clean codebase with documentation
- Proven patient engagement metrics

---

## 9. Verification Plan

### Development Testing
- Unit tests for all API endpoints
- Integration tests for critical flows
- UI tests for iOS app (XCTest)
- React Testing Library for web portals

### Pre-Launch Validation
1. Internal testing with mock clinic data
2. Security audit (third-party recommended)
3. HIPAA compliance review
4. TestFlight beta with 2-3 friendly clinics
5. Load testing (simulate 1000+ concurrent patients)

### Post-Launch Monitoring
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- User analytics (privacy-compliant, PostHog or Plausible)
- Uptime monitoring (BetterUptime, Checkly)
- Security scanning (regular dependency audits)

---

## 10. Project Structure

```
logmydose/
├── api/                              # Express.js backend
│   ├── src/
│   │   ├── index.ts                  # App entry point
│   │   ├── app.ts                    # Express app setup
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── patients.routes.ts
│   │   │   ├── protocols.routes.ts
│   │   │   ├── providers.routes.ts
│   │   │   ├── tenants.routes.ts
│   │   │   ├── admin.routes.ts
│   │   │   ├── peptides.routes.ts
│   │   │   ├── content.routes.ts
│   │   │   ├── billing.routes.ts
│   │   │   └── ai.routes.ts          # AI endpoints (insights, reports)
│   │   ├── controllers/              # Route handlers
│   │   ├── services/                 # Business logic
│   │   │   └── ai/                   # AI services
│   │   │       ├── insight.service.ts      # Proactive insight generation
│   │   │       ├── annotation.service.ts   # Inline annotations
│   │   │       ├── report.service.ts       # Weekly/monthly reports
│   │   │       ├── decision.service.ts     # Contextual decision support
│   │   │       ├── why.service.ts          # Why layer explanations
│   │   │       └── rag.service.ts          # RAG knowledge base queries
│   │   ├── ai/                       # AI core infrastructure
│   │   │   ├── providers/
│   │   │   │   ├── anthropic.ts      # Claude API client
│   │   │   │   ├── openai.ts         # OpenAI client (embeddings)
│   │   │   │   └── index.ts          # Provider abstraction
│   │   │   ├── prompts/
│   │   │   │   ├── insight.prompts.ts
│   │   │   │   ├── annotation.prompts.ts
│   │   │   │   ├── report.prompts.ts
│   │   │   │   ├── decision.prompts.ts
│   │   │   │   └── safety.prompts.ts # Medical disclaimers, safety rails
│   │   │   ├── rag/
│   │   │   │   ├── vectorStore.ts    # Pinecone/pgvector client
│   │   │   │   ├── embeddings.ts     # Text embedding utilities
│   │   │   │   └── retriever.ts      # Document retrieval
│   │   │   └── jobs/
│   │   │       ├── insightGenerator.job.ts  # Scheduled insight generation
│   │   │       └── reportGenerator.job.ts   # Weekly/monthly report jobs
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT verification
│   │   │   ├── tenantContext.ts      # Multi-tenancy
│   │   │   ├── rateLimiter.ts
│   │   │   └── auditLog.ts
│   │   ├── lib/
│   │   │   ├── db.ts                 # Prisma client
│   │   │   ├── jwt.ts                # Token utilities
│   │   │   ├── storage.ts            # S3 utilities
│   │   │   ├── stripe.ts             # Stripe utilities
│   │   │   └── cache.ts              # Redis/memory cache for AI responses
│   │   └── types/                    # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts                   # Peptide data seeding
│   ├── knowledge/                    # RAG knowledge base source documents
│   │   ├── peptides/                 # Peptide research, protocols
│   │   ├── bloodwork/                # Lab marker interpretations
│   │   └── guidelines/               # Dosing guidelines, safety info
│   ├── package.json
│   └── tsconfig.json
│
├── web/
│   ├── clinic-portal/                # React + Vite
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/             # API client
│   │   │   └── App.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── admin-portal/                 # React + Vite
│   │   └── (same structure)
│   │
│   └── patient-portal/               # React + Vite
│       └── (same structure)
│
├── ios/
│   └── LogMyDose/
│       ├── LogMyDose.xcodeproj
│       ├── Sources/
│       │   ├── App/
│       │   ├── Features/
│       │   │   ├── Auth/
│       │   │   ├── Dashboard/
│       │   │   ├── Protocols/
│       │   │   ├── Doses/
│       │   │   ├── Progress/
│       │   │   └── Education/
│       │   ├── Services/
│       │   │   ├── APIClient.swift
│       │   │   ├── AuthService.swift
│       │   │   └── StorageService.swift
│       │   └── UI/
│       └── Tests/
│
├── docs/
│   ├── HIPAA-compliance.md
│   ├── API-documentation.md
│   └── clinic-onboarding.md
│
└── README.md
```

---

## Next Steps

1. **Immediate:** Set up local Docker PostgreSQL for development
2. **Month 1, Week 1-2:** Initialize Express.js project, configure Prisma ORM, create database schema
3. **Month 1, Week 3-4:** Build authentication system and core API routes, seed peptide database
4. **Month 2:** Start clinic portal (React + Vite) with patient/protocol management
5. **Month 3+:** Begin iOS app foundation while iterating on backend
6. **Pre-Launch:** Sign up for Supabase Pro+, request BAA for HIPAA compliance, migrate data

---

## Summary

This plan provides a comprehensive roadmap to build a peptide therapy tracking platform with a **D2C-first** approach and optional clinic integration.

**Go-to-Market Strategy:**
1. Launch D2C app - users sign up, pick protocol templates, track doses
2. Build user base without needing clinic partnerships
3. Add clinic portal - clinics can invite/manage their patients
4. Clinics become upsell opportunity, not launch blocker

**Key Technical Decisions:**
- **iOS first** with Android following post-launch
- **Express.js API** hosted on Railway/Render
- **PostgreSQL (Supabase)** - clinic_id is optional (NULL = D2C user)
- **Docker PostgreSQL** for local development
- **React + Vite** for web portals (Clinic, Admin, Patient web)
- **Protocol templates** as core feature - users customize, not start from scratch
- **Substance-agnostic data model** - launch with peptides, expand to HRT/supplements/meds
- **Stripe** for D2C subscriptions + clinic billing

**HIPAA Note:**
- D2C self-tracking = personal health app (lighter compliance)
- Clinic integration = full HIPAA compliance required
- Build with HIPAA-ready architecture from start

The hybrid model provides faster path to market while maintaining acquisition value for telehealth platforms.

### Cost Estimates (Monthly at Launch Scale)

| Service | Free Tier | Growth (~100 patients) |
|---------|-----------|------------------------|
| Railway/Render | Free tier | Starter $5-20/mo |
| Supabase | Free tier | Pro $25/mo |
| Supabase Storage | Included | Included with Pro |
| Vercel (web apps) | Hobby free | Pro $20/mo |
| Stripe | 2.9% + 30¢ | Per transaction |
| Resend (email) | 3k/mo free | $20/mo |
| **Anthropic Claude API** | **Pay-per-use** | **~$50-150/mo*** |
| **OpenAI (embeddings)** | **Pay-per-use** | **~$10-20/mo** |
| **Pinecone (vectors)** | **Free tier** | **Starter $70/mo** |
| **Total** | **~$0** | **~$220-325/mo** |

*AI costs scale with usage. Estimates assume:
- ~100 active patients
- Weekly reports per patient (~400 reports/mo)
- ~10 insights/annotations per patient per day
- Caching and prompt optimization reduce redundant calls

**AI Cost Optimization Strategies:**
- Cache frequent annotations (e.g., peptide info doesn't change)
- Batch insight generation during off-peak hours
- Use smaller/faster models for simple tasks (Haiku for annotations)
- Pre-compute common patterns, only use LLM for novel situations

Note: HIPAA-compliant tiers (Supabase Pro+ with BAA, Railway Team/Enterprise) will increase costs significantly once handling real PHI.
