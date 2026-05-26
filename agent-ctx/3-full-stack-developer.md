# Task 3 - Fix Recaps Component

## Task: Fix Recaps - remove mock data, real task extraction, dynamic insights

### Work Log:
- Removed `mockTasks` array and `useState(mockTasks)` 
- Added `extractedTasks` useMemo that scans all memories using 11 action-pattern regexes (need to, should, must, have to, todo, follow up, call, email, schedule, remind me, don't forget)
- Each extracted task includes: id, text, completed (default false), memoryId
- Task completion tracked separately via `completedTaskIds` Set state, merged with extractedTasks in `displayTasks` useMemo
- Cap extracted tasks at 10, filter out duplicates and short text (< 5 chars)
- Replaced hardcoded AI Insight with dynamic `aiInsight` useMemo: counts today's memories by type, mentions actual tags, compares with week average for productivity assessment
- Replaced hardcoded "Most Active Day" with `mostActiveDay` useMemo derived from real `weekDays` data; falls back to empty message
- Added daily empty state: Brain icon + "No memories captured yet" + "Capture Memory" button (navigates to dashboard + opens capture modal)
- Added weekly empty state: Brain icon + "No memories this week yet" + "Capture Memory" button
- Cleaned up unused imports (CheckCircle2, Circle)
- Lint passes with 0 errors

### Stage Summary:
- All mock data removed from Recaps component
- Tasks are dynamically extracted from real user memories via pattern matching
- AI Insight dynamically generated from actual today's memory data (types, tags, week comparison)
- Most Active Day computed from real weekly activity data
- Both daily and weekly views have proper empty states with CTA buttons
