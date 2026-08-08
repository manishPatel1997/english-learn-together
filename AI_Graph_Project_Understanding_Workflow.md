# AI Graph Workflow: Understand an Existing Website Before Making Changes

## Purpose

This document defines a **Graph Engineering workflow** for
Claude/Codex/another AI agent to understand an existing website before
changing, rebuilding, or extending it.

The goal is NOT to immediately modify code.

The goal is to first build a reliable understanding of:

-   What the website does
-   What each feature does
-   How users interact with it
-   How pages/screens are connected
-   How data flows through the system
-   Which components implement each feature
-   Which APIs/services/database operations are involved
-   Which business rules exist
-   Which parts depend on other parts
-   Which behavior is intentional and must not be broken

The AI must treat the existing project as the source of truth.

------------------------------------------------------------------------

# 1. Core Graph

The AI should follow this graph:

``` text
                    EXISTING PROJECT
                           |
                           v
                    [1. DISCOVER]
                           |
                           v
                    [2. MAP PROJECT]
                           |
                           v
                    [3. UNDERSTAND UI]
                           |
                           v
                    [4. TRACE USER FLOWS]
                           |
                           v
              +------------+-------------+
              |            |             |
              v            v             v
        [FRONTEND]      [BACKEND]    [DATABASE]
              |            |             |
              +------------+-------------+
                           |
                           v
                    [5. TRACE DATA FLOW]
                           |
                           v
                    [6. IDENTIFY RULES]
                           |
                           v
                    [7. BUILD FEATURE MAP]
                           |
                           v
                    [8. VERIFY UNDERSTANDING]
                           |
                    +------+------+
                    |             |
                  FAIL           PASS
                    |             |
                    v             v
              [RESEARCH MORE] [9. DOCUMENT]
                    |             |
                    +----->-------+
                           |
                           v
                 PROJECT_KNOWLEDGE.md
```

Do not skip directly from `EXISTING PROJECT` to `IMPLEMENTATION`.

------------------------------------------------------------------------

# 2. Important Rule

The AI must separate these phases:

``` text
UNDERSTAND
    ↓
VERIFY
    ↓
DOCUMENT
    ↓
ONLY THEN
    ↓
CHANGE CODE
```

Never assume that a function name, component name, route name, or
variable name completely explains its purpose.

The AI must trace actual behavior.

------------------------------------------------------------------------

# 3. Phase 1 --- DISCOVER

## Objective

Understand the structure of the entire project.

Inspect:

-   package.json
-   configuration files
-   source directories
-   routing
-   pages
-   layouts
-   components
-   hooks
-   utilities
-   API routes
-   server code
-   database code
-   authentication
-   state management
-   external services
-   environment configuration
-   assets
-   tests
-   documentation

Create an initial project map.

Example:

``` text
project/
|
+-- app/
|   +-- dashboard/
|   +-- users/
|   +-- settings/
|   +-- login/
|
+-- components/
|   +-- Sidebar/
|   +-- Header/
|   +-- UserTable/
|
+-- hooks/
|
+-- lib/
|
+-- api/
|
+-- database/
|
+-- tests/
```

Do not modify files during this phase.

### Output

Create:

``` text
01_PROJECT_STRUCTURE.md
```

Include:

-   Directory structure
-   Important files
-   Technology stack
-   Entry points
-   Routing structure
-   Major dependencies
-   External services

------------------------------------------------------------------------

# 4. Phase 2 --- MAP THE APPLICATION

## Objective

Understand the website from the user's perspective.

Find every major screen/page.

For each page identify:

``` text
Page
 |
 +-- Purpose
 |
 +-- User can see
 |
 +-- User can do
 |
 +-- Data displayed
 |
 +-- API calls
 |
 +-- State
 |
 +-- Navigation
 |
 +-- Permissions
 |
 +-- Business rules
```

Example:

``` text
Dashboard
 |
 +-- Shows employee productivity
 |
 +-- Shows activity statistics
 |
 +-- Date filter
 |
 +-- Employee filter
 |
 +-- Calls /api/productivity
 |
 +-- Requires authenticated user
 |
 +-- Data depends on selected date
```

### Output

Create:

``` text
02_APPLICATION_MAP.md
```

------------------------------------------------------------------------

# 5. Phase 3 --- UNDERSTAND UI

For every important screen, determine:

-   What is visible?
-   What buttons exist?
-   What happens when each button is clicked?
-   What menus/dropdowns exist?
-   What happens on loading?
-   What happens on success?
-   What happens on failure?
-   What happens when there is no data?
-   What happens when the user changes filters?
-   What happens when the user navigates away?
-   What permissions affect the UI?

Build a user interaction graph.

Example:

``` text
Dashboard
   |
   +--> Select Employee
   |        |
   |        v
   |   Update Filter
   |        |
   |        v
   |   Fetch Data
   |        |
   |        v
   |   Update Chart
   |
   +--> Select Date
            |
            v
       Fetch Data
            |
            v
       Update Dashboard
```

### Important

Do not only read JSX/HTML.

Trace:

``` text
UI
 ↓
event handler
 ↓
function
 ↓
hook
 ↓
API
 ↓
server
 ↓
database/service
 ↓
response
 ↓
state update
 ↓
UI update
```

------------------------------------------------------------------------

# 6. Phase 4 --- TRACE USER FLOWS

This is one of the most important parts.

For every major feature, create a complete user flow.

Example:

``` text
USER
 ↓
Login page
 ↓
Enter credentials
 ↓
Submit
 ↓
Authentication function
 ↓
API
 ↓
Database
 ↓
Session/token created
 ↓
Redirect
 ↓
Dashboard
```

Another example:

``` text
USER
 ↓
Open Settings
 ↓
Change setting
 ↓
Click Save
 ↓
Frontend validation
 ↓
API request
 ↓
Backend validation
 ↓
Database update
 ↓
Response
 ↓
Frontend state update
 ↓
Success notification
```

The AI must identify the complete chain.

### Output

Create:

``` text
03_USER_FLOWS.md
```

------------------------------------------------------------------------

# 7. Phase 5 --- FRONTEND / BACKEND / DATABASE GRAPH

For every important feature, split the implementation into layers.

``` text
                    FEATURE
                       |
          +------------+------------+
          |            |            |
          v            v            v
       FRONTEND      BACKEND      DATABASE
          |            |            |
       Component      API         Table
          |            |            |
        Hook         Service      Query
          |            |            |
        State       Validation    Data
          |            |            |
          +------------+------------+
                       |
                       v
                    RESULT
```

For each feature document:

### Frontend

-   Component
-   Hook
-   State
-   Event handlers
-   Validation
-   Loading state
-   Error state

### Backend

-   API route
-   Controller/handler
-   Service
-   Validation
-   Authorization
-   Business logic

### Database

-   Tables/collections
-   Queries
-   Relationships
-   Writes
-   Reads
-   Transactions if applicable

------------------------------------------------------------------------

# 8. Phase 6 --- DATA FLOW

For each important operation, trace the data.

Example:

``` text
User selects date
       |
       v
React state
       |
       v
useProductivity()
       |
       v
GET /api/productivity?date=...
       |
       v
API handler
       |
       v
Validate date
       |
       v
Productivity service
       |
       v
Database query
       |
       v
Database result
       |
       v
Transform data
       |
       v
JSON response
       |
       v
React state
       |
       v
Chart
```

The AI must identify:

-   Input
-   Transformation
-   Validation
-   Storage
-   Output

Do not describe only the final result.

------------------------------------------------------------------------

# 9. Phase 7 --- BUSINESS RULES

Find rules that are not obvious from the UI.

Examples:

``` text
IF user.role == admin
    allow access

IF user.role == employee
    hide admin settings

IF date range > 30 days
    use aggregated endpoint

IF record already exists
    update
ELSE
    create

IF payment failed
    do not activate subscription
```

Every discovered business rule must be documented.

### Important

Separate:

``` text
FACT
```

from:

``` text
ASSUMPTION
```

Example:

``` text
FACT:
The API checks role === "admin".

ASSUMPTION:
This appears to mean only admins should access this page.
```

Never present assumptions as facts.

------------------------------------------------------------------------

# 10. Phase 8 --- DEPENDENCY GRAPH

Determine what depends on what.

Example:

``` text
Authentication
      |
      +----> Dashboard
      |
      +----> Settings
      |
      +----> Reports

Database
      |
      +----> Dashboard
      |
      +----> Reports

User Permissions
      |
      +----> Dashboard
      +----> Settings
      +----> Admin
```

This is important because changing one system can affect many other
systems.

For each major feature document:

``` text
Feature A
 |
 +-- depends on Feature B
 +-- depends on API C
 +-- depends on Database D
 +-- affects Feature E
```

------------------------------------------------------------------------

# 11. Phase 9 --- BUILD THE FEATURE GRAPH

Create one master graph for the website.

Example:

``` text
                         APPLICATION
                              |
       +----------------------+----------------------+
       |                      |                      |
       v                      v                      v
   AUTHENTICATION          DASHBOARD              SETTINGS
       |                      |                      |
       |              +-------+-------+              |
       |              |       |       |              |
       v              v       v       v              v
    SESSION        USERS   REPORTS  FILTERS      PREFERENCES
                      |       |       |
                      +-------+-------+
                              |
                              v
                           API LAYER
                              |
                              v
                           DATABASE
```

This should show the **real relationships discovered in the code**.

Do not invent relationships.

------------------------------------------------------------------------

# 12. Phase 10 --- VERIFY

Before documenting the final architecture, verify every important
conclusion.

For every feature ask:

``` text
Do I know:
✓ Where the UI starts?
✓ Which event starts the operation?
✓ Which function handles it?
✓ Which API is called?
✓ Which backend function runs?
✓ Which database operation happens?
✓ What business rules apply?
✓ What happens on success?
✓ What happens on failure?
✓ What other features depend on it?
```

If any answer is unknown:

``` text
UNKNOWN
   ↓
RESEARCH
   ↓
TRACE CODE
   ↓
VERIFY
```

Do not guess.

------------------------------------------------------------------------

# 13. Phase 11 --- CONFIDENCE LEVEL

For every documented feature, assign:

``` text
CONFIDENCE: HIGH
```

when the behavior was directly verified from code.

``` text
CONFIDENCE: MEDIUM
```

when most behavior is understood but one part was inferred.

``` text
CONFIDENCE: LOW
```

when important behavior could not be verified.

Example:

``` text
Feature: User Settings

Confidence: HIGH

Evidence:
- app/settings/page.tsx
- hooks/useSettings.ts
- api/settings.ts
- database/settings.ts
```

------------------------------------------------------------------------

# 14. Phase 12 --- FINAL KNOWLEDGE DOCUMENT

After all research is complete, create:

``` text
PROJECT_KNOWLEDGE.md
```

Use this structure:

``` text
# Project Knowledge

## 1. Project Overview

## 2. Technology Stack

## 3. Project Structure

## 4. Application Architecture

## 5. Page / Route Map

## 6. Feature Map

## 7. User Flows

## 8. Frontend Architecture

## 9. Backend Architecture

## 10. Database Architecture

## 11. API Map

## 12. Data Flows

## 13. Business Rules

## 14. Authentication / Authorization

## 15. State Management

## 16. External Services

## 17. Important Dependencies

## 18. Feature Dependency Graph

## 19. Known Edge Cases

## 20. Known Limitations

## 21. Unknown / Unverified Areas

## 22. Important Files

## 23. Change-Safety Notes
```

------------------------------------------------------------------------

# 15. Change-Safety Notes

This section is extremely important for future AI work.

Document things such as:

``` text
DO NOT CHANGE:
- Authentication flow without checking SessionManager
- API response format without checking Dashboard
- Database field names without checking migrations
- Shared component props without checking all consumers
```

Example:

``` text
Changing UserService.getUser()

Potentially affects:
    |
    +-- Dashboard
    +-- Profile
    +-- Settings
    +-- Admin panel
```

This tells future AI agents what they must investigate before changing
code.

------------------------------------------------------------------------

# 16. Future Bug-Fixing Graph

Once PROJECT_KNOWLEDGE.md exists, future tasks should use:

``` text
NEW BUG
   |
   v
READ PROJECT_KNOWLEDGE.md
   |
   v
LOCATE FEATURE
   |
   v
LOCATE USER FLOW
   |
   v
LOCATE DATA FLOW
   |
   v
RESEARCH IMPLEMENTATION
   |
   v
IDENTIFY ROOT CAUSE
   |
   v
DESIGN SOLUTION
   |
   v
IMPLEMENT
   |
   v
TEST
   |
   v
REVIEW
   |
   +---- FAIL ----> RESEARCH / FIX
   |
   +---- PASS ----> DONE
```

------------------------------------------------------------------------

# 17. Critical AI Rules

The AI MUST follow these rules.

### Rule 1 --- Do not code immediately

First understand.

### Rule 2 --- Do not trust names

A function called `handleSave()` may do much more than saving.

Trace it.

### Rule 3 --- Follow the complete flow

Always trace:

``` text
USER
 ↓
UI
 ↓
EVENT
 ↓
FUNCTION
 ↓
STATE
 ↓
API
 ↓
BACKEND
 ↓
DATABASE
 ↓
RESPONSE
 ↓
STATE
 ↓
UI
```

### Rule 4 --- Do not guess

If something is unknown:

``` text
UNKNOWN
```

Then investigate.

### Rule 5 --- Separate facts from assumptions

Never convert an assumption into documented architecture.

### Rule 6 --- Check dependencies before changes

Before changing a shared function/component/API, find all
callers/consumers.

### Rule 7 --- Preserve existing behavior

If the task is a bug fix, do not redesign unrelated functionality.

### Rule 8 --- Verify after implementation

A change is not complete just because the code compiles.

Test the actual behavior.

------------------------------------------------------------------------

# 18. Recommended Agent Graph

If using Claude Code with subagents, divide responsibilities like this:

``` text
                         MAIN AGENT
                             |
                             v
                         PLANNER
                             |
          +------------------+------------------+
          |                  |                  |
          v                  v                  v
   STRUCTURE AGENT      UI AGENT          FLOW AGENT
          |                  |                  |
          |                  |                  |
          +------------------+------------------+
                             |
                             v
                       DATA FLOW AGENT
                             |
                             v
                   BACKEND / API AGENT
                             |
                             v
                    DATABASE AGENT
                             |
                             v
                  BUSINESS RULE AGENT
                             |
                             v
                       REVIEW AGENT
                             |
                       +-----+-----+
                       |           |
                     FAIL        PASS
                       |           |
                       v           v
                   RESEARCH      FINAL
                       |
                       +-------> REVIEW
```

Each agent should have a narrow responsibility.

------------------------------------------------------------------------

# 19. What the Main Agent Should Produce

At the end, the main agent should be able to answer:

``` text
1. What does this website do?

2. What are all the major features?

3. What can the user do?

4. What happens when the user performs each action?

5. Which files implement each feature?

6. How does frontend communicate with backend?

7. How does backend communicate with the database?

8. What business rules exist?

9. Which features depend on each other?

10. What areas are dangerous to modify?

11. What behavior is still unknown?

12. How can a future AI safely modify the project?
```

If the AI cannot answer these questions, the project is **not fully
understood yet**.

------------------------------------------------------------------------

# 20. Final Principle

The goal is not:

``` text
AI reads files
      ↓
AI writes documentation
```

The goal is:

``` text
AI
 |
 +--> DISCOVER
 |
 +--> TRACE
 |
 +--> CONNECT
 |
 +--> VERIFY
 |
 +--> BUILD GRAPH
 |
 +--> DOCUMENT
 |
 +--> REMEMBER ARCHITECTURE
```

The resulting `PROJECT_KNOWLEDGE.md` becomes the **shared map of the
existing project**.

Future agents should read this map before investigating or changing
functionality.

Never treat this document as more authoritative than the actual source
code. If the code and the document disagree, re-research the code and
update the document.
