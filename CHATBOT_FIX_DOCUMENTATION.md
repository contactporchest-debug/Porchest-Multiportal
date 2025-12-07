# Chatbot Repetition Bug - FIXED

## 🐛 **What Was Wrong**

### **Problem 1: Criteria Never Refreshed**
**Symptom:**
- User: "Find fitness influencers"
  Bot: Asks for location
- User: "Pakistan"
  Bot: Returns fitness influencers in Pakistan ✓
- User: "Give me pet influencers"
  Bot: Still says "Got it! I'll look for fitness influencers in Pakistan..." ✗

**Root Cause:**
- The bot was relying on Gemini's AUTO tool calling mode
- Gemini would sometimes "remember" old criteria and not extract new ones
- No explicit criteria tracking or merging between requests
- Frontend sent `chatHistory` but not `previousCriteria`

### **Problem 2: Intent Detection Not Running Every Time**
**Root Cause:**
- Intent detection was optional
- Relied on Gemini to decide when to search
- Gemini sometimes just chatted instead of triggering DB search

### **Problem 3: No Smart Merge Logic**
**Root Cause:**
- When user changed niche, old niche persisted
- No distinction between "overwrite" vs "merge" scenarios
- No handling of "also", "add", "plus" keywords

### **Problem 4: MongoDB Search Not Guaranteed**
**Root Cause:**
- Search only happened if Gemini called the tool
- AUTO mode was unreliable
- Sometimes returned cached responses

---

## ✅ **How It's Fixed**

### **Fix 1: Mandatory Intent Gate on EVERY Message**

**Before:**
```typescript
// Optional intent check
if (isInfluencerSearchIntent(message)) {
  // Search...
}
```

**After:**
```typescript
// MANDATORY intent gate runs on EVERY message
const hasSearchIntent = isInfluencerSearchIntent(message);

if (hasSearchIntent) {
  // ALWAYS extract criteria
  // ALWAYS search MongoDB
  // ALWAYS return fresh results
}
```

**Keywords that trigger search:**
```
influencer, influencers, creator, creators, find, search, discover,
recommend, suggest, instagram, tiktok, youtube, show me, looking for,
need, want
```

---

### **Fix 2: Fresh Criteria Extraction Every Time**

**Before:**
```typescript
// Gemini decides what to extract (unreliable)
const result = await handleBrandChat({ message, chatHistory });
```

**After:**
```typescript
// STEP 1: Extract from current message (ALWAYS)
const newCriteria = await extractCriteriaWithGemini(message, chatHistory);

// STEP 2: Merge with previous criteria (smart rules)
const finalCriteria = mergeCriteria(previousCriteria, newCriteria, message);

// STEP 3: Search MongoDB with final criteria
const results = await searchInfluencersWithRetry(finalCriteria);
```

---

### **Fix 3: Smart Criteria Merge with Overwrite Rules**

**Merge Rules:**

| Scenario | User Says | Old Criteria | New Criteria | Result |
|----------|-----------|--------------|--------------|--------|
| **Overwrite category** | "Find pet influencers" | `{category: "Fitness"}` | `{category: "Pet"}` | `{category: "Pet"}` ✓ |
| **Merge category** | "Also find tech influencers" | `{category: "Fashion"}` | `{category: "Tech"}` | `{category: "Fashion, Tech"}` ✓ |
| **Overwrite location** | "In USA" | `{location: "Pakistan"}` | `{location: "USA"}` | `{location: "USA"}` ✓ |
| **Remove location** | "Any location" | `{location: "Pakistan"}` | `{}` | `{location: undefined}` ✓ |
| **Keep old if not mentioned** | "With 100k followers" | `{category: "Tech", location: "USA"}` | `{minFollowers: 100000}` | `{category: "Tech", location: "USA", minFollowers: 100000}` ✓ |

**Code Implementation:**
```typescript
// lib/mergeCriteria.ts

export function mergeCriteria(
  oldCriteria: SearchCriteria | null,
  newCriteria: SearchCriteria,
  message: string
): SearchCriteria {
  const hasMergeIntent = /also|add|plus|along with|as well|and/.test(message.toLowerCase());

  // Category merging
  if (newCriteria.category) {
    if (hasMergeIntent && oldCriteria.category !== newCriteria.category) {
      merged.category = `${oldCriteria.category}, ${newCriteria.category}`; // MERGE
    } else {
      merged.category = newCriteria.category; // OVERWRITE
    }
  } else {
    merged.category = oldCriteria.category; // KEEP OLD
  }

  // ... similar logic for location, followers, engagement, platforms
}
```

---

### **Fix 4: MongoDB Search Runs on Every Influencer Intent**

**Before:**
```typescript
// Gemini decides whether to search (unreliable)
const result = await handleBrandChat({ message, chatHistory });
// Sometimes searches, sometimes doesn't
```

**After:**
```typescript
// Intent detected → ALWAYS search MongoDB
if (hasSearchIntent) {
  const finalCriteria = mergeCriteria(previousCriteria, newCriteria, message);

  // GUARANTEED MongoDB search
  const { results, relaxed } = await searchInfluencersWithRetry(finalCriteria);

  // ALWAYS return fresh results
  return { reply, influencers: results, criteria: finalCriteria };
}
```

---

### **Fix 5: Comprehensive Logging**

**Every request gets unique ID with full trace:**

```
[abc123] === NEW REQUEST ===
[abc123] User authenticated { userId: "xyz" }
[abc123] Request parsed { message: "Give me pet influencers", hasPreviousCriteria: true, previousCriteria: {category: "Fitness", location: "Pakistan"} }
[abc123] Intent detection { hasSearchIntent: true }
[abc123] === INFLUENCER SEARCH PATH ===
[abc123] New criteria extracted { newCriteria: {category: "Pet"} }
[abc123] Final criteria after merge { finalCriteria: {category: "Pet", location: "Pakistan"} }
[abc123] INTENT CHANGE DETECTED - user switched topics
[abc123] Search complete { count: 5, relaxed: false }
[abc123] Results formatted
[abc123] Natural response generated
```

**Key logs:**
- ✅ Previous criteria received
- ✅ New criteria extracted
- ✅ Final merged criteria
- ✅ Intent change detection
- ✅ MongoDB query
- ✅ Results count
- ✅ Relaxation status

---

## 📊 **Request/Response Flow**

### **Request Format (Frontend Must Send)**

```typescript
POST /api/brand-chat
{
  "message": "Give me pet influencers",
  "chatHistory": [
    {"role": "user", "text": "I need fitness influencers"},
    {"role": "model", "text": "Great! Which location?"},
    {"role": "user", "text": "Pakistan"},
    {"role": "model", "text": "Found 12 fitness influencers in Pakistan..."}
  ],
  "previousCriteria": {
    "category": "Fitness",
    "location": "Pakistan"
  }
}
```

**CRITICAL:** Frontend must:
1. Track `previousCriteria` from last response
2. Include it in next request
3. Update it with each response's `criteria` field

### **Response Format**

```typescript
{
  "success": true,
  "data": {
    "reply": "Great! I found 5 pet influencers in Pakistan...",
    "influencers": [
      {
        "id": "...",
        "name": "Ahmed's Pet World",
        "username": "ahmedpets",
        "niche": "Pet",
        "location": "Pakistan",
        "followers": 125000,
        "engagementRate": 5.4,
        // ... more fields
      },
      // ... 4 more
    ],
    "criteria": {
      "category": "Pet",
      "location": "Pakistan"
    },
    "relaxed": false,
    "intent": "search",
    "intentChange": true,
    "method": "robust-fixed"
  }
}
```

**Frontend must:**
```typescript
// Store criteria for next request
const [currentCriteria, setCurrentCriteria] = useState(null);

// On response
if (data.criteria) {
  setCurrentCriteria(data.criteria);
}

// On next request
const response = await fetch('/api/brand-chat', {
  method: 'POST',
  body: JSON.stringify({
    message: userMessage,
    chatHistory: messages,
    previousCriteria: currentCriteria, // ← CRITICAL
  })
});
```

---

## 🧪 **Example Conversations**

### **Example 1: Niche Change (Overwrite)**

**Request 1:**
```json
{
  "message": "I need fitness influencers",
  "chatHistory": [],
  "previousCriteria": null
}
```

**Response 1:**
```json
{
  "reply": "I'd love to help! Which location do you prefer?",
  "influencers": [],
  "criteria": {"category": "Fitness"},
  "needsMoreInfo": true
}
```

**Request 2:**
```json
{
  "message": "Pakistan",
  "chatHistory": [
    {"role": "user", "text": "I need fitness influencers"},
    {"role": "model", "text": "Which location?"}
  ],
  "previousCriteria": {"category": "Fitness"}
}
```

**Response 2:**
```json
{
  "reply": "Found 12 fitness influencers in Pakistan...",
  "influencers": [/* 12 fitness influencers */],
  "criteria": {"category": "Fitness", "location": "Pakistan"}
}
```

**Request 3: INTENT CHANGE**
```json
{
  "message": "Give me pet influencers",
  "chatHistory": [/* previous messages */],
  "previousCriteria": {"category": "Fitness", "location": "Pakistan"}
}
```

**Response 3:**
```json
{
  "reply": "Found 5 pet influencers in Pakistan...",
  "influencers": [/* 5 PET influencers */],
  "criteria": {"category": "Pet", "location": "Pakistan"},
  "intentChange": true
}
```

**✅ Result:** Category changed from "Fitness" to "Pet", location kept!

---

### **Example 2: Niche Merge (With "also")**

**Request 1:**
```json
{
  "message": "Find fashion influencers in New York",
  "previousCriteria": null
}
```

**Response 1:**
```json
{
  "criteria": {"category": "Fashion", "location": "New York"},
  "influencers": [/* fashion influencers */]
}
```

**Request 2: MERGE**
```json
{
  "message": "Also show me tech influencers",
  "previousCriteria": {"category": "Fashion", "location": "New York"}
}
```

**Response 2:**
```json
{
  "criteria": {"category": "Fashion, Tech", "location": "New York"},
  "influencers": [/* both fashion AND tech influencers */]
}
```

**✅ Result:** Categories merged because of "also"!

---

### **Example 3: Location Removal**

**Request 1:**
```json
{
  "message": "Find tech influencers in Los Angeles",
  "previousCriteria": null
}
```

**Response 1:**
```json
{
  "criteria": {"category": "Tech", "location": "Los Angeles"},
  "influencers": [/* LA tech influencers */]
}
```

**Request 2: REMOVE LOCATION**
```json
{
  "message": "Show me from any location",
  "previousCriteria": {"category": "Tech", "location": "Los Angeles"}
}
```

**Response 2:**
```json
{
  "criteria": {"category": "Tech"},
  "influencers": [/* tech influencers from ALL locations */]
}
```

**✅ Result:** Location filter removed!

---

### **Example 4: No Results → Auto-Retry Relaxation**

**Request:**
```json
{
  "message": "Find quantum physics influencers in Antarctica with 10M followers",
  "previousCriteria": null
}
```

**Internal Flow:**
```
1. Extract: {category: "Quantum Physics", location: "Antarctica", minFollowers: 10000000}
2. Search MongoDB → 0 results
3. Relax filters: {category: "Quantum Physics", minFollowers: 7000000} (remove location, -30% followers)
4. Retry search → Still 0 results
5. Return no results response
```

**Response:**
```json
{
  "reply": "I couldn't find any influencers matching your criteria (even after expanding the search).\n\n**Suggestions:**\n• Try a broader location\n• Reduce follower requirements",
  "influencers": [],
  "criteria": {"category": "Quantum Physics", "location": "Antarctica", "minFollowers": 10000000},
  "relaxed": true
}
```

---

## 🚀 **Deployment Changes Required**

### **1. Frontend Must Track `previousCriteria`**

**Add to your chat component:**

```typescript
const [currentCriteria, setCurrentCriteria] = useState<SearchCriteria | null>(null);

// When sending message
const sendMessage = async (message: string) => {
  const response = await fetch('/api/brand-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      chatHistory: messages,
      previousCriteria: currentCriteria, // ← ADD THIS
    })
  });

  const data = await response.json();

  // Update criteria
  if (data.data.criteria) {
    setCurrentCriteria(data.data.criteria); // ← ADD THIS
  }

  // Render influencers
  if (data.data.influencers && data.data.influencers.length > 0) {
    renderInfluencers(data.data.influencers); // ← ADD THIS
  }
};
```

### **2. Render Influencers in UI**

```typescript
// Add influencer rendering guard
if (data.influencers?.length > 0) {
  return (
    <div>
      <div className="bot-message">{data.reply}</div>
      <div className="influencers-grid">
        {data.influencers.map(inf => (
          <InfluencerCard key={inf.id} influencer={inf} />
        ))}
      </div>
    </div>
  );
}
```

---

## 📝 **What Changed in Code**

### **Files Modified:**

1. **`/app/api/brand-chat/route.ts`** - Complete rewrite
   - Added `previousCriteria` to request schema
   - Added mandatory intent gate
   - Added criteria extraction + merge on every request
   - Added comprehensive logging

2. **`/lib/mergeCriteria.ts`** - NEW FILE
   - Smart merge logic
   - Overwrite vs merge detection
   - Intent change detection

3. **`/lib/extractCriteriaWithGemini.ts`** - Already exists
   - 2-step extraction (Gemini JSON + Zod + regex fallback)

4. **`/lib/searchInfluencersRobust.ts`** - Already exists
   - Scoring + auto-retry with relaxation

5. **`/lib/intentDetection.ts`** - Already exists
   - Mandatory intent detection

6. **`/lib/formatInfluencerResults.ts`** - Already exists
   - Deterministic formatting

---

## ✅ **Why This Fix Works**

| Problem | Fix |
|---------|-----|
| ❌ Criteria never refreshed | ✅ Extract fresh criteria on EVERY message |
| ❌ Old niche persists | ✅ Overwrite old niche unless "also" keyword |
| ❌ Intent not detected every time | ✅ Mandatory intent gate runs ALWAYS |
| ❌ MongoDB search unreliable | ✅ ALWAYS search when intent detected |
| ❌ Gemini AUTO mode fails | ✅ Don't rely on AUTO, force search manually |
| ❌ No criteria tracking | ✅ Frontend sends `previousCriteria` each request |
| ❌ Hard to debug | ✅ Comprehensive logging with request ID |

---

## 🎯 **Summary**

**Before:** Bot stuck repeating old answers because:
- Relied on Gemini AUTO tool calling (unreliable)
- No explicit criteria tracking
- No merge logic
- No intent gate

**After:** Bot always returns fresh results because:
- ✅ **Mandatory intent gate** on every message
- ✅ **Fresh criteria extraction** every time
- ✅ **Smart merge** with overwrite rules
- ✅ **MongoDB search** guaranteed on intent
- ✅ **Comprehensive logging** for debugging
- ✅ **Frontend tracks** `previousCriteria`

**Result:** 🎉 No more repetition! Bot correctly handles niche changes and "also" merges.

---

**Created:** 2025-12-06
**Version:** 3.0.0 (Repetition Fix)
