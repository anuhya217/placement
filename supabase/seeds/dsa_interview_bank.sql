-- Curated placement / interview staples with I/O sketches + LeetCode links.
-- Run in Supabase SQL Editor after migrations (merges/upgrades rows by slug).
-- https://leetcode.com/problem-list/ — LC does not expose OAuth login for arbitrary third-party websites; users link their handle in Settings instead.

INSERT INTO public.problems (
  category, title, slug, difficulty, description,
  problem_statement, input_format, output_format, sample_io, constraints_text,
  leetcode_url, interviewer_tips
) VALUES

-- ========== Arrays ==========
(
  'Arrays', 'Two Sum', 'two-sum', 'Easy', 'Classic hash-map / two-pointer warm-up.',
  'Given integer array nums and target, return indices of two distinct positions whose values sum to target (exactly one answer exists).',
  'nums: integer array; target: integer.',
  'An array [i, j] with i != j ordering may follow problem statement on LC.',
  E'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]',
  E'~2≤|nums|≤10^4.',
  'https://leetcode.com/problems/two-sum/',
  'Starts many interviews; clarify sorted vs unsorted, duplicates, uniqueness of answer.'
),
(
  'Arrays', 'Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'Easy', 'Greedy valley/peak.',
  E'Prices per day — pick one buy and one sell afterward to maximise profit.',
  E'integer array prices.',
  E'single integer profit (0 allowed).',
  E'Input: prices = [7,1,5,3,6,4]\nOutput: 5',
  E'1≤|prices|≤10^5.',
  'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
  'Ask for brute O(n²) improvement to O(n) single pass valley.'
),
(
  'Arrays', 'Contains Duplicate', 'contains-duplicate', 'Easy', 'Set/hash quick win.',
  'Return true if any value appears at least twice.',
  E'nums: integer array.',
  E'boolean.',
  E'Input: [1,2,3,1]\nOutput: true',
  E'≤10^5 elements.',
  'https://leetcode.com/problems/contains-duplicate/',
  'Tests basic structure choice vs sort + sweep.'
),
(
  'Arrays', 'Product of Array Except Self', 'product-of-array-except-self', 'Medium', 'Prefix / suffix tricks.',
  'Return array ans where ans[i] = product of all nums except nums[i], without division (LC variant).',
  E'nums: integer array length ≥2.',
  E'integer array length n.',
  E'Input: [1,2,3,4]\nOutput: [24,12,8,6]',
  E'nums may include zeros — discuss overflow handling.',
  'https://leetcode.com/problems/product-of-array-except-self/',
  'Follow-up constant extra space excluding output array.'
),
(
  'Arrays', 'Maximum Subarray', 'maximum-subarray', 'Medium', 'Kadane template.',
  'Contiguous subarray with largest sum.',
  E'integers array.',
  E'single maximal sum.',
  E'Input: [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6',
  E'classic constraints per LC.',
  'https://leetcode.com/problems/maximum-subarray/',
  'Discuss divide & conquer rarely needed; interviewer wants Kadane intuition.'
),

-- Strings
(
  'Strings', 'Valid Parentheses', 'valid-parentheses', 'Easy', 'Stack canonical.',
  'Given string containing ()[]{}, determine nesting validity.',
  E'string s.',
  E'boolean.',
  'Input: "()[] {}". Output: true for valid nesting.',
  E'≤10^4 length.',
  'https://leetcode.com/problems/valid-parentheses/',
  'Edge-only strings, asymmetric close order.'
),
(
  'Strings', 'Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium', 'Sliding window.',
  'Length of longest substring with all distinct characters.',
  E'string s ASCII.',
  E'integer length.',
  E'Input: abcabcbb\nOutput: 3 ("abc").',
  E'≤5·10^4.',
  'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
  'Discuss map vs bucket array optimisation.'
),
(
  'Strings', 'Group Anagrams', 'group-anagrams', 'Medium', 'Hash of counts / sort key.',
  'Cluster strings that are mutual anagrams.',
  E'array of lowercase strings.',
  E'groups of anagram buckets.',
  E'See LC examples.',
  E'length limits per LC.',
  'https://leetcode.com/problems/group-anagrams/',
  'Compare O(n*k) keyed frequency vs sorting each string.'
),

-- Trees
(
  'Trees', 'Invert Binary Tree', 'invert-binary-tree', 'Easy', 'Traversal / recurse.',
  'Swap left/right subtree for each node recursively or iteratively.',
  E'binary tree root.',
  E'inverted tree root.',
  E'classic LC visuals.',
  E'small n interview scale.',
  'https://leetcode.com/problems/invert-binary-tree/',
  'Famously infamous screen — tests comfort with recursion.'
),
(
  'Trees', 'Binary Tree Maximum Depth', 'maximum-depth-of-binary-tree', 'Easy',
  'Classic tree height.',
  'Compute max depth defined as nodes along longest path from root down to farthest leaf.',
  E'tree.',
  E'integer depth.',
  E'Input: balanced tree heights example.\nOutput: per LC.',
  E'≤10^4 nodes typical.',
  'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
  'Extend to iterative BFS layering.'
),
(
  'Trees', 'Lowest Common Ancestor of a Binary Tree', 'lowest-common-ancestor-of-a-binary-tree', 'Medium',
  'Structure insight.',
  'Find LCA given two node references in general binary tree.',
  E'root,p,q.',
  E'LCA node.',
  E'classic diagram.',
  E'constraints per LC.',
  'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
  'Clarify values unique? BST variant follow-up differs.'
),

-- Graphs
(
  'Graphs', 'Number of Islands', 'number-of-islands', 'Medium', 'Grid DFS/BFS.',
  'Connected components of ''1'' in binary grid counting islands.',
  E'char grid mxn.',
  E'integer count.',
  E'classic sample grid.',
  E'm,n ≤ ~300 LC.',
  'https://leetcode.com/problems/number-of-islands/',
  'Mutating grid vs visited set optimisation trade-off.'
),
(
  'Graphs', 'Course Schedule', 'course-schedule', 'Medium', 'Topological sort cycle.',
  'Return if you can finish all courses given prerequisites (DAG detection).',
  E'numCourses, prerequisites pairs.',
  E'boolean.',
  E'pairs form edges.',
  E'constraints per LC.',
  'https://leetcode.com/problems/course-schedule/',
  'Discuss Kahn BFS indegree vs DFS color states.'
),

-- DP
(
  'Dynamic Programming', 'Climbing Stairs', 'climbing-stairs', 'Easy',
  'Fibonacci style.',
  E'Distinct ways reach top taking 1–2 steps.',
  E'int n stairs.',
  E'integer count.',
  E'n=3 → 3 ways.',
  E'n ≤ ~45 brute ok.',
  'https://leetcode.com/problems/climbing-stairs/',
  E'Transition recurrence clarity.'
),
(
  'Dynamic Programming', 'House Robber', 'house-robber', 'Medium',
  'Linear DP with skip constraint.',
  'Max money robbing houses on street without touching two neighbours.',
  E'integer array monies.',
  E'maximized sum.',
  E'classic examples.',
  E'constraints per LC.',
  'https://leetcode.com/problems/house-robber/',
  E'Circular street variant preview.'
),
(
  'Dynamic Programming', 'Coin Change', 'coin-change', 'Medium',
  'Classic unbounded/min coins.',
  'Minimum coins forming amount (coins unlimited) or −1.',
  E'coins array, amount.',
  E'integer min count.',
  E'coins=[1,2,5], amount=11→3 coins.',
  E'constraints per LC.',
  'https://leetcode.com/problems/coin-change/',
  E'Top-down memo vs tabulation space optimised.'
),

-- Greedy
(
  'Greedy', 'Jump Game', 'jump-game', 'Medium',
  E'Greedy reachable index.',
  'Can reach last index jumps bounded by nums[i]?',
  E'nums non‑negative.',
  E'boolean.',
  E'Sample leaps.',
  E'constraints per LC.',
  'https://leetcode.com/problems/jump-game/',
  E'Discuss min jumps follow-up differs problem.'
),

-- Recursion / backtracking
(
  'Recursion', 'Subsets', 'subsets', 'Medium',
  'Power set/backtracking staple.',
  'All subsets of discrete array.',
  E'integer array nums distinct-ish per LC variant.',
  E'list of subsets.',
  E'n=3 exponential count.',
  E'constraints per LC.',
  'https://leetcode.com/problems/subsets/',
  E'Bitmask vs DFS tree depth discussion.'
),

-- ========== MORE per topic ==========
(
  'Arrays','Merge Intervals','merge-intervals','Medium','Meeting planning favourite.',
 E'Overlapping intervals merging.',
 E'List of intervals [start,end].',
 E'Merged disjoint sorted list.',
 E'Input: [[1,3],[2,6],[8,10],[15,18]] Output: merged.',
 E'O(n log n).',
 'https://leetcode.com/problems/merge-intervals/',
 E'Interviewers ask ordering trick first.'
),
(
  'Arrays','Trapping Rain Water','trapping-rain-water','Hard','Two-pointer / stacks.',
 E'Calculate trapped water elevation map.',
 E'integer height array.',
 E'total litres int.',
 E'classic bar chart.',
 E'LC constraints.',
 'https://leetcode.com/problems/trapping-rain-water/',
 E'Monotonic stack rationale vs two pointers heights.'
),
(
  'Arrays','Rotate Array','rotate-array','Medium','In-place rotations.',
 E'Rotate k steps right cyclic.',
 E'nums, k.',
 E'modifies nums.',
 E'See LC.',
 E'LC constraints.',
 'https://leetcode.com/problems/rotate-array/',
 E'Extra space O(n) expectation vs reversal trick.'
),

(
  'Strings','Valid Palindrome','valid-palindrome','Easy','Two pointers sanitise chars.',
 E'Alphanumeric ignore case symmetry.',
 E's string.',
 E'boolean.',
 E'classic.',
 E'Small n.',
 'https://leetcode.com/problems/valid-palindrome/',
 E'Mutating vs immutable string language differences.'
),

(
  'Trees','Validate Binary Search Tree','validate-binary-search-tree','Medium','Bounds propagation.',
 E'BST property check recursively/iter.',
 E'root.',
 E'boolean valid.',
 E'LC examples traps INT_MIN edge.',
 E'constraints per LC.',
 'https://leetcode.com/problems/validate-binary-search-tree/',
 E'Mention inorder strictly increasing test.'
),

(
  'Trees','Diameter of Binary Tree','diameter-of-binary-tree','Medium','Height DP.',
 E'Longest path between any nodes may pass root or not measured by edges.',
 E'root.',
 E'integer longest edges.',
 E'LC visuals.',
 E'node count modest.',
 'https://leetcode.com/problems/diameter-of-binary-tree/',
 E'Max subtree height recurrence lesson.'
),

(
  'Graphs','Rotting Oranges','rotting-oranges','Medium','Multi-source BFS time layers.',
 E'Minute layers spread rot to fresh oranges grid.',
 E'grid 0 empty 1 fresh 2 rotten.',
 E'-1 impossible else minutes.',
 E'LC grids.',
 E'm,n moderate.',
 'https://leetcode.com/problems/rotting-oranges/',
 E'Mini matrix BFS scaffolding.'
),

(
  'Greedy','Non-overlapping Intervals','non-overlapping-intervals','Medium','Interval scheduling.',
 E'Min removals to eliminate overlaps sorted by end.',
 E'intervals array.',
 E'integer min removals.',
 E'classic.',
 E'O(n log n).',
 'https://leetcode.com/problems/non-overlapping-intervals/',
 E'Greedy choice proof sketch.'
),

(
  'Greedy','Task Scheduler','task-scheduler','Medium','Cool-down scheduling maths.',
 E'Least units schedule tasks with cooldown n.',
 E'tasks chars, idle gap n.',
 E'integer time units.',
 E'LC elaborate.',
 E'Often medium-hard discussion.',
 'https://leetcode.com/problems/task-scheduler/',
 E'Equation max(len, buckets) interviewer variant.'
),

(
  'Dynamic Programming','Longest Increasing Subsequence','longest-increasing-subsequence','Medium',
 E'Classic patience / binary search improvement.',
 E'integer array nums.',
 E'integer LIS length.',
 E'Example small.',
 E'O(n²) naive vs O(n log n).',
 'https://leetcode.com/problems/longest-increasing-subsequence/',
 E'Follow-up optimise subsequence reconstruction.'
),

(
  'Dynamic Programming','Edit Distance','edit-distance','Hard',
 E'Classic string DP transformations.',
 E'two words.',
 E'min ops insert delete replace.',
 E'classic small table.',
 E'LC bounds.',
 'https://leetcode.com/problems/edit-distance/',
 E'Space compression row-by-row.'
),

(
  'Graphs','Number of Connected Components','number-of-connected-components-in-an-undirected-graph','Medium',
 E'Adjacency modelling practice.',
 E'n nodes edges list.',
 E'integer components.',
 E'LC graph notation.',
 E'constraints per LC.',
 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
 E'Explain union-find vs DFS component sweep.'
),

(
  'Strings','Minimum Window Substring','minimum-window-substring','Hard',
 E'Sliding window with frequency debt.',
 E's,t strings ASCII.',
 E'shortest contiguous substring covering multiset t.',
 E'classic sample.',
 E'Large but bounded LC.',
 'https://leetcode.com/problems/minimum-window-substring/',
 E'Most dreaded medium-hard onsite builder.'
),

(
  'Recursion','Permutations','permutations','Medium',
 E'DFS swap / visited vector.',
 E'distinct integers array.',
 E'all orderings.',
 E'length≤6 interview toy bigger LC.',
 E'LC constraints.',
 'https://leetcode.com/problems/permutations/',
 E'Distinguish duplicates variant follow-up.'
),
(
  'Recursion','Combination Sum','combination-sum','Medium',
 E'Backtrack unbounded picks sum target.',
 E'candidates,target.',
 E'all unique combos ascending.',
 E'See LC.',
 E'positive ints.',
 'https://leetcode.com/problems/combination-sum/',
 E'Prune duplicates ordering technique.'
),

(
  'Strings','Find the Index of First Occurrence','find-the-index-of-the-first-occurrence-in-a-string','Easy',
 'Needle/haystack first match.',
 'Return index of first occurrence of substring needle in haystack, or −1.',
 'haystack string, needle string.',
 'integer index · or −1 if absent.',
 E'classic LC examples.',
 'length bounded per LC.',
 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
 E'Rolling hash / KMP for senior signals.'
),

(
  'Trees','Symmetric Tree','symmetric-tree','Easy',
 E'Mirror left-right equality.',
 E'root.',
 E'boolean.',
 E'small symmetrical tree.',
 E'nodes moderate.',
 'https://leetcode.com/problems/symmetric-tree/',
 E'Leverage invert + compare shortcut discussion.'
),

(
  'Greedy','Partition Labels','partition-labels','Medium',
 E'Greedy sweep last occurrence map.',
 E's lowercase string.',
 E'partition lengths list.',
 E'LC sample ababcbac...',
 E'length moderate.',
 'https://leetcode.com/problems/partition-labels/',
 E'Interview friendly linear scan story.'
),

(
  'Dynamic Programming','Word Break','word-break','Medium',
 E'Dictionary segmentation DP/BFS.',
 E's string, wordDict.',
 E'segmentable?',
 E'True false classic.',
 E'LC dictionary sizes.',
 'https://leetcode.com/problems/word-break/',
 E'Trial segment tree optimisation rarely needed.'
)

ON CONFLICT (slug) DO UPDATE SET
  category = excluded.category,
  title = excluded.title,
  difficulty = excluded.difficulty,
  description = excluded.description,
  problem_statement = excluded.problem_statement,
  input_format = excluded.input_format,
  output_format = excluded.output_format,
  sample_io = excluded.sample_io,
  constraints_text = excluded.constraints_text,
  leetcode_url = excluded.leetcode_url,
  interviewer_tips = excluded.interviewer_tips;
