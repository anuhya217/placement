export type Difficulty = "Easy" | "Medium" | "Hard";

export interface LeetCodeDsaQuestion {
  id: string; // unique string id
  title: string;
  difficulty: Difficulty;
  week: number;
  day: number; // optional day inside week
  topic: string;
  description: string;
  leetcode_url: string;
  hints: string[];
}

export const dsaQuestions: LeetCodeDsaQuestion[] = [
  // Week 1: Arrays & Hashing
  {
    id: "dsa-001",
    title: "Contains Duplicate",
    difficulty: "Easy",
    week: 1,
    day: 1,
    topic: "Arrays & Hashing",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    leetcode_url: "https://leetcode.com/problems/contains-duplicate/",
    hints: ["Try using a Hash Set to store elements you have seen so far."]
  },
  {
    id: "dsa-002",
    title: "Valid Anagram",
    difficulty: "Easy",
    week: 1,
    day: 2,
    topic: "Arrays & Hashing",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    leetcode_url: "https://leetcode.com/problems/valid-anagram/",
    hints: ["You can use a frequency map or an array of size 26 if the inputs are just lowercase English letters."]
  },
  {
    id: "dsa-003",
    title: "Two Sum",
    difficulty: "Easy",
    week: 1,
    day: 3,
    topic: "Arrays & Hashing",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    leetcode_url: "https://leetcode.com/problems/two-sum/",
    hints: ["Use a hash map to store the elements and their indices. For each element x, check if target - x exists in the map."]
  },
  {
    id: "dsa-004",
    title: "Group Anagrams",
    difficulty: "Medium",
    week: 1,
    day: 4,
    topic: "Arrays & Hashing",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    leetcode_url: "https://leetcode.com/problems/group-anagrams/",
    hints: ["Sort each string and use it as a key in a hash map, or use a character count array as the key."]
  },
  {
    id: "dsa-005",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    week: 1,
    day: 5,
    topic: "Arrays & Hashing",
    description: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    leetcode_url: "https://leetcode.com/problems/top-k-frequent-elements/",
    hints: ["Use a hash map to count frequencies, then use a priority queue (min-heap) or bucket sort to find the top k."]
  },
  
  // Week 2: Two Pointers & Stack
  {
    id: "dsa-006",
    title: "Valid Palindrome",
    difficulty: "Easy",
    week: 2,
    day: 1,
    topic: "Two Pointers",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    leetcode_url: "https://leetcode.com/problems/valid-palindrome/",
    hints: ["Use two pointers, one at the beginning and one at the end, and move them towards the center."]
  },
  {
    id: "dsa-007",
    title: "3Sum",
    difficulty: "Medium",
    week: 2,
    day: 2,
    topic: "Two Pointers",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    leetcode_url: "https://leetcode.com/problems/3sum/",
    hints: ["Sort the array first. Iterate through the array and use two pointers for the remaining elements."]
  },
  {
    id: "dsa-008",
    title: "Container With Most Water",
    difficulty: "Medium",
    week: 2,
    day: 3,
    topic: "Two Pointers",
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    leetcode_url: "https://leetcode.com/problems/container-with-most-water/",
    hints: ["Use two pointers starting at the ends. Move the pointer with the shorter height inward."]
  },
  {
    id: "dsa-009",
    title: "Valid Parentheses",
    difficulty: "Easy",
    week: 2,
    day: 4,
    topic: "Stack",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    leetcode_url: "https://leetcode.com/problems/valid-parentheses/",
    hints: ["Use a stack. Push opening brackets. When encountering a closing bracket, check if it matches the top of the stack."]
  },
  {
    id: "dsa-010",
    title: "Min Stack",
    difficulty: "Medium",
    week: 2,
    day: 5,
    topic: "Stack",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    leetcode_url: "https://leetcode.com/problems/min-stack/",
    hints: ["Consider using an extra stack to keep track of the minimum values, or store pairs of (value, current_min) in the main stack."]
  },

  // Week 3: Sliding Window & Linked List
  {
    id: "dsa-011",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    week: 3,
    day: 1,
    topic: "Sliding Window",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    hints: ["Keep track of the minimum price seen so far and update the maximum profit at each step."]
  },
  {
    id: "dsa-012",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    week: 3,
    day: 2,
    topic: "Sliding Window",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    leetcode_url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    hints: ["Use a sliding window with two pointers and a hash set or hash map to track characters in the current window."]
  },
  {
    id: "dsa-013",
    title: "Reverse Linked List",
    difficulty: "Easy",
    week: 3,
    day: 3,
    topic: "Linked List",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    leetcode_url: "https://leetcode.com/problems/reverse-linked-list/",
    hints: ["Maintain three pointers: prev, curr, and next. Update them as you iterate through the list."]
  },
  {
    id: "dsa-014",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    week: 3,
    day: 4,
    topic: "Linked List",
    description: "Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.",
    leetcode_url: "https://leetcode.com/problems/merge-two-sorted-lists/",
    hints: ["Use a dummy node to form the new list. Compare the heads of both lists and attach the smaller one."]
  },
  {
    id: "dsa-015",
    title: "Reorder List",
    difficulty: "Medium",
    week: 3,
    day: 5,
    topic: "Linked List",
    description: "You are given the head of a singly linked-list. The list can be represented as: L0 → L1 → … → Ln - 1 → Ln. Reorder the list to be on the following form: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …",
    leetcode_url: "https://leetcode.com/problems/reorder-list/",
    hints: ["Find the middle of the list, reverse the second half, and merge the two halves alternately."]
  },

  // Week 4: Trees
  {
    id: "dsa-016",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    week: 4,
    day: 1,
    topic: "Trees",
    description: "Given the root of a binary tree, invert the tree, and return its root.",
    leetcode_url: "https://leetcode.com/problems/invert-binary-tree/",
    hints: ["Swap the left and right children recursively."]
  },
  {
    id: "dsa-017",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    week: 4,
    day: 2,
    topic: "Trees",
    description: "Given the root of a binary tree, return its maximum depth.",
    leetcode_url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    hints: ["The depth of a tree is 1 + max(depth of left subtree, depth of right subtree)."]
  },
  {
    id: "dsa-018",
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    week: 4,
    day: 3,
    topic: "Trees",
    description: "Given the root of a binary tree, return the length of the diameter of the tree.",
    leetcode_url: "https://leetcode.com/problems/diameter-of-binary-tree/",
    hints: ["The diameter passing through a node is the depth of its left subtree plus the depth of its right subtree. Track the max diameter during a depth calculation."]
  },
  {
    id: "dsa-019",
    title: "Lowest Common Ancestor of a Binary Search Tree",
    difficulty: "Medium",
    week: 4,
    day: 4,
    topic: "Trees",
    description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.",
    leetcode_url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    hints: ["Use the BST property: if both values are smaller than root, go left. If both are larger, go right. Otherwise, the current node is the LCA."]
  },
  {
    id: "dsa-020",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    week: 4,
    day: 5,
    topic: "Trees",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    leetcode_url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    hints: ["Use a queue to perform a breadth-first search (BFS). Keep track of the number of nodes at each level."]
  },

  // Week 5: Tries & Heap/Priority Queue
  {
    id: "dsa-021",
    title: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    week: 5,
    day: 1,
    topic: "Tries",
    description: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class.",
    leetcode_url: "https://leetcode.com/problems/implement-trie-prefix-tree/",
    hints: ["Each node should contain a boolean flag indicating if it's the end of a word and an array/map of child nodes."]
  },
  {
    id: "dsa-022",
    title: "Design Add and Search Words Data Structure",
    difficulty: "Medium",
    week: 5,
    day: 2,
    topic: "Tries",
    description: "Design a data structure that supports adding new words and finding if a string matches any previously added string. The search string can contain '.' to match any letter.",
    leetcode_url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
    hints: ["Use a Trie. When searching with '.', use backtracking to check all possible children paths."]
  },
  {
    id: "dsa-023",
    title: "Kth Largest Element in a Stream",
    difficulty: "Easy",
    week: 5,
    day: 3,
    topic: "Heap / Priority Queue",
    description: "Design a class to find the kth largest element in a stream.",
    leetcode_url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
    hints: ["Use a min-heap of size k. The root of the heap will always be the kth largest element."]
  },
  {
    id: "dsa-024",
    title: "Last Stone Weight",
    difficulty: "Easy",
    week: 5,
    day: 4,
    topic: "Heap / Priority Queue",
    description: "You are given an array of integers stones where stones[i] is the weight of the ith stone. Smash the two heaviest stones together until there is at most one stone left.",
    leetcode_url: "https://leetcode.com/problems/last-stone-weight/",
    hints: ["Use a max-heap (or priority queue) to efficiently retrieve and remove the two heaviest stones."]
  },
  {
    id: "dsa-025",
    title: "K Closest Points to Origin",
    difficulty: "Medium",
    week: 5,
    day: 5,
    topic: "Heap / Priority Queue",
    description: "Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0).",
    leetcode_url: "https://leetcode.com/problems/k-closest-points-to-origin/",
    hints: ["Use a max-heap of size k to store the distances. If a new point is closer than the max in the heap, replace it."]
  },

  // Week 6: Backtracking & Graphs
  {
    id: "dsa-026",
    title: "Subsets",
    difficulty: "Medium",
    week: 6,
    day: 1,
    topic: "Backtracking",
    description: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    leetcode_url: "https://leetcode.com/problems/subsets/",
    hints: ["Use recursion. At each step, you can either include the current element or exclude it."]
  },
  {
    id: "dsa-027",
    title: "Combination Sum",
    difficulty: "Medium",
    week: 6,
    day: 2,
    topic: "Backtracking",
    description: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.",
    leetcode_url: "https://leetcode.com/problems/combination-sum/",
    hints: ["Use backtracking. Since you can use elements infinitely, you don't need to increment the index when making a recursive call if you pick the element."]
  },
  {
    id: "dsa-028",
    title: "Number of Islands",
    difficulty: "Medium",
    week: 6,
    day: 3,
    topic: "Graphs",
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    leetcode_url: "https://leetcode.com/problems/number-of-islands/",
    hints: ["Iterate through the grid. When you find a '1', increment island count and use DFS/BFS to mark all connected '1's as visited."]
  },
  {
    id: "dsa-029",
    title: "Clone Graph",
    difficulty: "Medium",
    week: 6,
    day: 4,
    topic: "Graphs",
    description: "Return a deep copy (clone) of a graph. Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.",
    leetcode_url: "https://leetcode.com/problems/clone-graph/",
    hints: ["Use a hash map to map original nodes to their clones to avoid infinite loops and duplicate clones."]
  },
  {
    id: "dsa-030",
    title: "Course Schedule",
    difficulty: "Medium",
    week: 6,
    day: 5,
    topic: "Graphs",
    description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses.",
    leetcode_url: "https://leetcode.com/problems/course-schedule/",
    hints: ["This is a cycle detection problem in a directed graph. Use topological sort (Kahn's algorithm) or DFS with states (unvisited, visiting, visited)."]
  },

  // Week 7: Advanced Graphs & 1D Dynamic Programming
  {
    id: "dsa-031",
    title: "Network Delay Time",
    difficulty: "Medium",
    week: 7,
    day: 1,
    topic: "Advanced Graphs",
    description: "You are given a network of n nodes, labeled from 1 to n. You are given times, a list of travel times as directed edges times[i] = (ui, vi, wi), where ui is the source node, vi is the target node, and wi is the time it takes for a signal to travel from source to target. Return the minimum time it takes for all the n nodes to receive the signal.",
    leetcode_url: "https://leetcode.com/problems/network-delay-time/",
    hints: ["Use Dijkstra's algorithm to find the shortest paths from the starting node to all other nodes."]
  },
  {
    id: "dsa-032",
    title: "Climbing Stairs",
    difficulty: "Easy",
    week: 7,
    day: 2,
    topic: "1D Dynamic Programming",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    leetcode_url: "https://leetcode.com/problems/climbing-stairs/",
    hints: ["This is exactly the Fibonacci sequence. The number of ways to reach step n is ways(n-1) + ways(n-2)."]
  },
  {
    id: "dsa-033",
    title: "Min Cost Climbing Stairs",
    difficulty: "Easy",
    week: 7,
    day: 3,
    topic: "1D Dynamic Programming",
    description: "You are given an integer array cost where cost[i] is the cost of ith step on a staircase. Once you pay the cost, you can either climb one or two steps. You can either start from the step with index 0, or the step with index 1. Return the minimum cost to reach the top of the floor.",
    leetcode_url: "https://leetcode.com/problems/min-cost-climbing-stairs/",
    hints: ["Let dp[i] be the min cost to reach step i. dp[i] = cost[i] + min(dp[i-1], dp[i-2])."]
  },
  {
    id: "dsa-034",
    title: "House Robber",
    difficulty: "Medium",
    week: 7,
    day: 4,
    topic: "1D Dynamic Programming",
    description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.",
    leetcode_url: "https://leetcode.com/problems/house-robber/",
    hints: ["For each house i, you can either rob it (money[i] + dp[i-2]) or skip it (dp[i-1])."]
  },
  {
    id: "dsa-035",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    week: 7,
    day: 5,
    topic: "1D Dynamic Programming",
    description: "Given a string s, return the longest palindromic substring in s.",
    leetcode_url: "https://leetcode.com/problems/longest-palindromic-substring/",
    hints: ["Expand around center for each character and each pair of characters."]
  },

  // Week 8: 2D Dynamic Programming & Bit Manipulation
  {
    id: "dsa-036",
    title: "Unique Paths",
    difficulty: "Medium",
    week: 8,
    day: 1,
    topic: "2D Dynamic Programming",
    description: "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.",
    leetcode_url: "https://leetcode.com/problems/unique-paths/",
    hints: ["dp[i][j] = dp[i-1][j] + dp[i][j-1]. Can be optimized to O(n) space."]
  },
  {
    id: "dsa-037",
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    week: 8,
    day: 2,
    topic: "2D Dynamic Programming",
    description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
    leetcode_url: "https://leetcode.com/problems/longest-common-subsequence/",
    hints: ["If text1[i] == text2[j], dp[i][j] = 1 + dp[i-1][j-1]. Else dp[i][j] = max(dp[i-1][j], dp[i][j-1])."]
  },
  {
    id: "dsa-038",
    title: "Best Time to Buy and Sell Stock with Cooldown",
    difficulty: "Medium",
    week: 8,
    day: 3,
    topic: "2D Dynamic Programming",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve. You may complete as many transactions as you like with the following restriction: After you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day).",
    leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
    hints: ["Use state machine with 3 states: holding stock, unheld (cooldown), and unheld (ready to buy)."]
  },
  {
    id: "dsa-039",
    title: "Single Number",
    difficulty: "Easy",
    week: 8,
    day: 4,
    topic: "Bit Manipulation",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    leetcode_url: "https://leetcode.com/problems/single-number/",
    hints: ["Use the XOR operator. x ^ x = 0 and x ^ 0 = x."]
  },
  {
    id: "dsa-040",
    title: "Number of 1 Bits",
    difficulty: "Easy",
    week: 8,
    day: 5,
    topic: "Bit Manipulation",
    description: "Write a function that takes the binary representation of an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).",
    leetcode_url: "https://leetcode.com/problems/number-of-1-bits/",
    hints: ["n & (n - 1) removes the lowest set bit. Repeat until n is 0."]
  }
];
