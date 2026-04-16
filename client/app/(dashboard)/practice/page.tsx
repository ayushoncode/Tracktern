"use client"

import { useState, useEffect, useMemo } from "react"
import { Code2, ExternalLink, CheckCircle, Flame, Trophy, Target, ChevronRight, ArrowLeft, Play, CalendarDays, Sparkles, Activity, Info, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const SHEET_DATA = [
  {
    topic: "Array + Basic Hashing", patterns: 2, total: 34,
    icon: "▦",
    subPatterns: [
      { name: "Arrays", count: 15, problems: [
        { title: "Two Sum", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/" },
        { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
        { title: "Contains Duplicate", difficulty: "Easy", link: "https://leetcode.com/problems/contains-duplicate/" },
        { title: "Maximum Subarray", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-subarray/" },
        { title: "Product of Array Except Self", difficulty: "Medium", link: "https://leetcode.com/problems/product-of-array-except-self/" },
        { title: "Maximum Product Subarray", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-product-subarray/" },
        { title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
        { title: "Search in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
        { title: "3Sum", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/" },
        { title: "Container With Most Water", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/" },
        { title: "Rotate Array", difficulty: "Medium", link: "https://leetcode.com/problems/rotate-array/" },
        { title: "Move Zeroes", difficulty: "Easy", link: "https://leetcode.com/problems/move-zeroes/" },
        { title: "Missing Number", difficulty: "Easy", link: "https://leetcode.com/problems/missing-number/" },
        { title: "Find All Duplicates in Array", difficulty: "Medium", link: "https://leetcode.com/problems/find-all-duplicates-in-an-array/" },
        { title: "Trapping Rain Water", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/" },
      ]},
      { name: "Arrays + Hashing", count: 19, problems: [
        { title: "Group Anagrams", difficulty: "Medium", link: "https://leetcode.com/problems/group-anagrams/" },
        { title: "Top K Frequent Elements", difficulty: "Medium", link: "https://leetcode.com/problems/top-k-frequent-elements/" },
        { title: "Encode and Decode Strings", difficulty: "Medium", link: "https://leetcode.com/problems/encode-and-decode-strings/" },
        { title: "Longest Consecutive Sequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-consecutive-sequence/" },
        { title: "Valid Anagram", difficulty: "Easy", link: "https://leetcode.com/problems/valid-anagram/" },
        { title: "Two Sum II", difficulty: "Medium", link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
        { title: "Subarray Sum Equals K", difficulty: "Medium", link: "https://leetcode.com/problems/subarray-sum-equals-k/" },
        { title: "Count Good Pairs", difficulty: "Easy", link: "https://leetcode.com/problems/number-of-good-pairs/" },
        { title: "Intersection of Two Arrays", difficulty: "Easy", link: "https://leetcode.com/problems/intersection-of-two-arrays/" },
        { title: "Majority Element", difficulty: "Easy", link: "https://leetcode.com/problems/majority-element/" },
        { title: "Sort Characters By Frequency", difficulty: "Medium", link: "https://leetcode.com/problems/sort-characters-by-frequency/" },
        { title: "Minimum Index Sum of Two Lists", difficulty: "Easy", link: "https://leetcode.com/problems/minimum-index-sum-of-two-lists/" },
        { title: "Find Common Characters", difficulty: "Easy", link: "https://leetcode.com/problems/find-common-characters/" },
        { title: "Ransom Note", difficulty: "Easy", link: "https://leetcode.com/problems/ransom-note/" },
        { title: "Happy Number", difficulty: "Easy", link: "https://leetcode.com/problems/happy-number/" },
        { title: "Isomorphic Strings", difficulty: "Easy", link: "https://leetcode.com/problems/isomorphic-strings/" },
        { title: "Word Pattern", difficulty: "Easy", link: "https://leetcode.com/problems/word-pattern/" },
        { title: "4Sum II", difficulty: "Medium", link: "https://leetcode.com/problems/4sum-ii/" },
        { title: "Count Number of Texts", difficulty: "Medium", link: "https://leetcode.com/problems/count-number-of-texts/" },
      ]},
    ]
  },
  {
    topic: "String + Basic Hashing", patterns: 2, total: 30,
    icon: "</>",
    subPatterns: [
      { name: "Strings", count: 12, problems: [
        { title: "Valid Palindrome", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/" },
        { title: "Longest Palindromic Substring", difficulty: "Medium", link: "https://leetcode.com/problems/longest-palindromic-substring/" },
        { title: "Palindromic Substrings", difficulty: "Medium", link: "https://leetcode.com/problems/palindromic-substrings/" },
        { title: "Reverse String", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-string/" },
        { title: "Reverse Words in a String", difficulty: "Medium", link: "https://leetcode.com/problems/reverse-words-in-a-string/" },
        { title: "String to Integer (atoi)", difficulty: "Medium", link: "https://leetcode.com/problems/string-to-integer-atoi/" },
        { title: "Implement strStr()", difficulty: "Easy", link: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/" },
        { title: "Longest Common Prefix", difficulty: "Easy", link: "https://leetcode.com/problems/longest-common-prefix/" },
        { title: "Count and Say", difficulty: "Medium", link: "https://leetcode.com/problems/count-and-say/" },
        { title: "ZigZag Conversion", difficulty: "Medium", link: "https://leetcode.com/problems/zigzag-conversion/" },
        { title: "Multiply Strings", difficulty: "Medium", link: "https://leetcode.com/problems/multiply-strings/" },
        { title: "Add Binary", difficulty: "Easy", link: "https://leetcode.com/problems/add-binary/" },
      ]},
      { name: "Strings + Hashing", count: 15, problems: [
        { title: "Anagram Groups", difficulty: "Medium", link: "https://leetcode.com/problems/group-anagrams/" },
        { title: "First Unique Character", difficulty: "Easy", link: "https://leetcode.com/problems/first-unique-character-in-a-string/" },
        { title: "Find All Anagrams", difficulty: "Medium", link: "https://leetcode.com/problems/find-all-anagrams-in-a-string/" },
        { title: "Permutation in String", difficulty: "Medium", link: "https://leetcode.com/problems/permutation-in-string/" },
        { title: "Minimum Window Substring", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-window-substring/" },
        { title: "Longest Substring Without Repeating", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
        { title: "Longest Repeating Character Replacement", difficulty: "Medium", link: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
        { title: "Custom Sort String", difficulty: "Medium", link: "https://leetcode.com/problems/custom-sort-string/" },
        { title: "Unique Email Addresses", difficulty: "Easy", link: "https://leetcode.com/problems/unique-email-addresses/" },
        { title: "Jewels and Stones", difficulty: "Easy", link: "https://leetcode.com/problems/jewels-and-stones/" },
        { title: "Check if Two Strings Are Equivalent", difficulty: "Easy", link: "https://leetcode.com/problems/check-if-two-string-arrays-are-equivalent/" },
        { title: "Number of Different Integers", difficulty: "Easy", link: "https://leetcode.com/problems/number-of-different-integers-in-a-string/" },
        { title: "Sentence Similarity", difficulty: "Easy", link: "https://leetcode.com/problems/sentence-similarity/" },
        { title: "Substring with Concatenation of All Words", difficulty: "Hard", link: "https://leetcode.com/problems/substring-with-concatenation-of-all-words/" },
        { title: "Decode the Slanted Ciphertext", difficulty: "Medium", link: "https://leetcode.com/problems/decode-the-slanted-ciphertext/" },
      ]},
    ]
  },
  {
    topic: "Binary Search", patterns: 6, total: 41,
    icon: "⌕",
    subPatterns: [
      { name: "Basic Problems on Sorted Array", count: 7, problems: [
        { title: "Binary Search", difficulty: "Easy", link: "https://leetcode.com/problems/binary-search/" },
        { title: "Guess Number Higher or Lower", difficulty: "Easy", link: "https://leetcode.com/problems/guess-number-higher-or-lower/" },
        { title: "First Bad Version", difficulty: "Easy", link: "https://leetcode.com/problems/first-bad-version/" },
        { title: "Sqrt(x)", difficulty: "Easy", link: "https://leetcode.com/problems/sqrtx/" },
        { title: "Count Negative Numbers in Sorted Matrix", difficulty: "Easy", link: "https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/" },
        { title: "Search a 2D Matrix", difficulty: "Medium", link: "https://leetcode.com/problems/search-a-2d-matrix/" },
        { title: "Search a 2D Matrix II", difficulty: "Medium", link: "https://leetcode.com/problems/search-a-2d-matrix-ii/" },
      ]},
      { name: "Lower And Upper Bound", count: 6, problems: [
        { title: "Find First and Last Position", difficulty: "Medium", link: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/" },
        { title: "Find Smallest Letter Greater Than Target", difficulty: "Easy", link: "https://leetcode.com/problems/find-smallest-letter-greater-than-target/" },
        { title: "Count Elements With Strictly Smaller and Greater Elements", difficulty: "Easy", link: "https://leetcode.com/problems/count-elements-with-strictly-smaller-and-greater-elements/" },
        { title: "Find Target Indices After Sorting Array", difficulty: "Easy", link: "https://leetcode.com/problems/find-target-indices-after-sorting-array/" },
        { title: "Maximum Count of Positive and Negative Integer", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-count-of-positive-integer-and-negative-integer/" },
        { title: "Count of Range Sum", difficulty: "Hard", link: "https://leetcode.com/problems/count-of-range-sum/" },
      ]},
      { name: "Binary Search On Rotated Sorted Array", count: 5, problems: [
        { title: "Search in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
        { title: "Search in Rotated Sorted Array II", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/" },
        { title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
        { title: "Find Minimum in Rotated Sorted Array II", difficulty: "Hard", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/" },
        { title: "Find Rotation Count", difficulty: "Easy", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
      ]},
      { name: "Binary Search on Answer", count: 12, problems: [
        { title: "Koko Eating Bananas", difficulty: "Medium", link: "https://leetcode.com/problems/koko-eating-bananas/" },
        { title: "Minimum Number of Days to Make m Bouquets", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/" },
        { title: "Capacity To Ship Packages Within D Days", difficulty: "Medium", link: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/" },
        { title: "Split Array Largest Sum", difficulty: "Hard", link: "https://leetcode.com/problems/split-array-largest-sum/" },
        { title: "Minimize Maximum of Array", difficulty: "Medium", link: "https://leetcode.com/problems/minimize-maximum-of-array/" },
        { title: "Find the Smallest Divisor Given a Threshold", difficulty: "Medium", link: "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/" },
        { title: "Magnetic Force Between Two Balls", difficulty: "Medium", link: "https://leetcode.com/problems/magnetic-force-between-two-balls/" },
        { title: "Aggressive Cows", difficulty: "Medium", link: "https://leetcode.com/problems/magnetic-force-between-two-balls/" },
        { title: "Book Allocation", difficulty: "Hard", link: "https://leetcode.com/problems/split-array-largest-sum/" },
        { title: "Median of Two Sorted Arrays", difficulty: "Hard", link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
        { title: "Nth Root of a Number", difficulty: "Medium", link: "https://leetcode.com/problems/sqrtx/" },
        { title: "Find Nth Root", difficulty: "Medium", link: "https://leetcode.com/problems/sqrtx/" },
      ]},
      { name: "Floating Point Binary Search", count: 5, problems: [
        { title: "Sqrt(x) Floating Point", difficulty: "Easy", link: "https://leetcode.com/problems/sqrtx/" },
        { title: "Find the Square Root", difficulty: "Easy", link: "https://leetcode.com/problems/sqrtx/" },
        { title: "Nth Root (Floating)", difficulty: "Medium", link: "https://leetcode.com/problems/sqrtx/" },
        { title: "Minimize Max Distance to Gas Station", difficulty: "Hard", link: "https://leetcode.com/problems/minimize-max-distance-to-gas-station/" },
        { title: "Swim in Rising Water", difficulty: "Hard", link: "https://leetcode.com/problems/swim-in-rising-water/" },
      ]},
      { name: "Miscellaneous Binary Search Problems", count: 6, problems: [
        { title: "Peak Index in a Mountain Array", difficulty: "Medium", link: "https://leetcode.com/problems/peak-index-in-a-mountain-array/" },
        { title: "Find Peak Element", difficulty: "Medium", link: "https://leetcode.com/problems/find-peak-element/" },
        { title: "Single Element in a Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/single-element-in-a-sorted-array/" },
        { title: "Find K Closest Elements", difficulty: "Medium", link: "https://leetcode.com/problems/find-k-closest-elements/" },
        { title: "Random Pick with Weight", difficulty: "Medium", link: "https://leetcode.com/problems/random-pick-with-weight/" },
        { title: "Search Suggestions System", difficulty: "Medium", link: "https://leetcode.com/problems/search-suggestions-system/" },
      ]},
    ]
  },
  {
    topic: "Two Pointers", patterns: 3, total: 29,
    icon: "↔",
    subPatterns: [
      { name: "Standard Problems on Array", count: 10, problems: [
        { title: "Two Sum II", difficulty: "Medium", link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
        { title: "3Sum", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/" },
        { title: "4Sum", difficulty: "Medium", link: "https://leetcode.com/problems/4sum/" },
        { title: "Container With Most Water", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/" },
        { title: "Trapping Rain Water", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/" },
        { title: "Sort Colors", difficulty: "Medium", link: "https://leetcode.com/problems/sort-colors/" },
        { title: "Remove Duplicates from Sorted Array", difficulty: "Easy", link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
        { title: "Remove Element", difficulty: "Easy", link: "https://leetcode.com/problems/remove-element/" },
        { title: "Squares of a Sorted Array", difficulty: "Easy", link: "https://leetcode.com/problems/squares-of-a-sorted-array/" },
        { title: "Merge Sorted Array", difficulty: "Easy", link: "https://leetcode.com/problems/merge-sorted-array/" },
      ]},
      { name: "Standard Problems on Strings", count: 10, problems: [
        { title: "Valid Palindrome", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/" },
        { title: "Valid Palindrome II", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome-ii/" },
        { title: "Reverse String", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-string/" },
        { title: "Reverse Vowels of a String", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-vowels-of-a-string/" },
        { title: "Backspace String Compare", difficulty: "Easy", link: "https://leetcode.com/problems/backspace-string-compare/" },
        { title: "Long Pressed Name", difficulty: "Easy", link: "https://leetcode.com/problems/long-pressed-name/" },
        { title: "Is Subsequence", difficulty: "Easy", link: "https://leetcode.com/problems/is-subsequence/" },
        { title: "Count Binary Substrings", difficulty: "Easy", link: "https://leetcode.com/problems/count-binary-substrings/" },
        { title: "Partition Labels", difficulty: "Medium", link: "https://leetcode.com/problems/partition-labels/" },
        { title: "Minimum Number of Swaps to Make String Balanced", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/" },
      ]},
      { name: "Two Pointers + Hashing", count: 9, problems: [
        { title: "Subarray Sum Equals K", difficulty: "Medium", link: "https://leetcode.com/problems/subarray-sum-equals-k/" },
        { title: "Max Number of K-Sum Pairs", difficulty: "Medium", link: "https://leetcode.com/problems/max-number-of-k-sum-pairs/" },
        { title: "Boats to Save People", difficulty: "Medium", link: "https://leetcode.com/problems/boats-to-save-people/" },
        { title: "Minimize Maximum Pair Sum in Array", difficulty: "Medium", link: "https://leetcode.com/problems/minimize-maximum-pair-sum-in-array/" },
        { title: "3Sum With Multiplicity", difficulty: "Medium", link: "https://leetcode.com/problems/3sum-with-multiplicity/" },
        { title: "3Sum Closest", difficulty: "Medium", link: "https://leetcode.com/problems/3sum-closest/" },
        { title: "Number of Subsequences That Satisfy Given Sum Condition", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-subsequences-that-satisfy-the-given-sum-condition/" },
        { title: "Count Nice Pairs in Array", difficulty: "Medium", link: "https://leetcode.com/problems/count-nice-pairs-in-an-array/" },
        { title: "Closest Pair", difficulty: "Medium", link: "https://leetcode.com/problems/3sum-closest/" },
      ]},
    ]
  },
  {
    topic: "Sliding Window", patterns: 2, total: 24,
    icon: "▦",
    subPatterns: [
      { name: "Fixed Size Window", count: 12, problems: [
        { title: "Maximum Average Subarray I", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-average-subarray-i/" },
        { title: "Number of Sub-arrays of Size K and Average >= Threshold", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/" },
        { title: "Sliding Window Maximum", difficulty: "Hard", link: "https://leetcode.com/problems/sliding-window-maximum/" },
        { title: "Find All Anagrams in a String", difficulty: "Medium", link: "https://leetcode.com/problems/find-all-anagrams-in-a-string/" },
        { title: "Permutation in String", difficulty: "Medium", link: "https://leetcode.com/problems/permutation-in-string/" },
        { title: "Contains Duplicate II", difficulty: "Easy", link: "https://leetcode.com/problems/contains-duplicate-ii/" },
        { title: "Maximum Points You Can Obtain from Cards", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/" },
        { title: "K Radius Subarray Averages", difficulty: "Medium", link: "https://leetcode.com/problems/k-radius-subarray-averages/" },
        { title: "Grumpy Bookstore Owner", difficulty: "Medium", link: "https://leetcode.com/problems/grumpy-bookstore-owner/" },
        { title: "Maximum Number of Vowels in Substring of Length K", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/" },
        { title: "Diet Plan Performance", difficulty: "Easy", link: "https://leetcode.com/problems/diet-plan-performance/" },
        { title: "Maximum Sum of Two Non-Overlapping Subarrays", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/" },
      ]},
      { name: "Variable Size Window", count: 12, problems: [
        { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
        { title: "Minimum Window Substring", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-window-substring/" },
        { title: "Longest Repeating Character Replacement", difficulty: "Medium", link: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
        { title: "Minimum Size Subarray Sum", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-size-subarray-sum/" },
        { title: "Fruit Into Baskets", difficulty: "Medium", link: "https://leetcode.com/problems/fruit-into-baskets/" },
        { title: "Max Consecutive Ones III", difficulty: "Medium", link: "https://leetcode.com/problems/max-consecutive-ones-iii/" },
        { title: "Subarray Product Less Than K", difficulty: "Medium", link: "https://leetcode.com/problems/subarray-product-less-than-k/" },
        { title: "Count Number of Nice Subarrays", difficulty: "Medium", link: "https://leetcode.com/problems/count-number-of-nice-subarrays/" },
        { title: "Binary Subarrays With Sum", difficulty: "Medium", link: "https://leetcode.com/problems/binary-subarrays-with-sum/" },
        { title: "Subarrays with K Different Integers", difficulty: "Hard", link: "https://leetcode.com/problems/subarrays-with-k-different-integers/" },
        { title: "Longest Turbulent Subarray", difficulty: "Medium", link: "https://leetcode.com/problems/longest-turbulent-subarray/" },
        { title: "Longest Subarray of 1s After Deleting One Element", difficulty: "Medium", link: "https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/" },
      ]},
    ]
  },
  {
    topic: "Linked Lists", patterns: 6, total: 57,
    icon: "○",
    subPatterns: [
      { name: "Traversal in Singly Linked List", count: 10, problems: [
        { title: "Reverse Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-linked-list/" },
        { title: "Middle of the Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/middle-of-the-linked-list/" },
        { title: "Merge Two Sorted Lists", difficulty: "Easy", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
        { title: "Palindrome Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/palindrome-linked-list/" },
        { title: "Remove Duplicates from Sorted List", difficulty: "Easy", link: "https://leetcode.com/problems/remove-duplicates-from-sorted-list/" },
        { title: "Linked List Cycle", difficulty: "Easy", link: "https://leetcode.com/problems/linked-list-cycle/" },
        { title: "Intersection of Two Linked Lists", difficulty: "Easy", link: "https://leetcode.com/problems/intersection-of-two-linked-lists/" },
        { title: "Convert Binary Number in Linked List to Integer", difficulty: "Easy", link: "https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/" },
        { title: "Delete Node in Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/delete-node-in-a-linked-list/" },
        { title: "Remove Linked List Elements", difficulty: "Easy", link: "https://leetcode.com/problems/remove-linked-list-elements/" },
      ]},
      { name: "Insertion/Deletion in Singly Linked List", count: 8, problems: [
        { title: "Remove Nth Node From End of List", difficulty: "Medium", link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
        { title: "Add Two Numbers", difficulty: "Medium", link: "https://leetcode.com/problems/add-two-numbers/" },
        { title: "Swap Nodes in Pairs", difficulty: "Medium", link: "https://leetcode.com/problems/swap-nodes-in-pairs/" },
        { title: "Rotate List", difficulty: "Medium", link: "https://leetcode.com/problems/rotate-list/" },
        { title: "Partition List", difficulty: "Medium", link: "https://leetcode.com/problems/partition-list/" },
        { title: "Delete the Middle Node of a Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/" },
        { title: "Odd Even Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/odd-even-linked-list/" },
        { title: "Insert into a Sorted Circular Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/insert-into-a-sorted-circular-linked-list/" },
      ]},
      { name: "Linked List with Two Pointers/Hash Table", count: 17, problems: [
        { title: "Linked List Cycle II", difficulty: "Medium", link: "https://leetcode.com/problems/linked-list-cycle-ii/" },
        { title: "Find the Duplicate Number", difficulty: "Medium", link: "https://leetcode.com/problems/find-the-duplicate-number/" },
        { title: "Copy List with Random Pointer", difficulty: "Medium", link: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
        { title: "Reorder List", difficulty: "Medium", link: "https://leetcode.com/problems/reorder-list/" },
        { title: "LRU Cache", difficulty: "Medium", link: "https://leetcode.com/problems/lru-cache/" },
        { title: "LFU Cache", difficulty: "Hard", link: "https://leetcode.com/problems/lfu-cache/" },
        { title: "Flatten a Multilevel Doubly Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/" },
        { title: "Split Linked List in Parts", difficulty: "Medium", link: "https://leetcode.com/problems/split-linked-list-in-parts/" },
        { title: "Remove Duplicates from Sorted List II", difficulty: "Medium", link: "https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/" },
        { title: "Reverse Nodes in k-Group", difficulty: "Hard", link: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
        { title: "Swapping Nodes in a Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/swapping-nodes-in-a-linked-list/" },
        { title: "Reverse Linked List II", difficulty: "Medium", link: "https://leetcode.com/problems/reverse-linked-list-ii/" },
        { title: "Next Greater Node In Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/next-greater-node-in-linked-list/" },
        { title: "Design Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/design-linked-list/" },
        { title: "Design Browser History", difficulty: "Medium", link: "https://leetcode.com/problems/design-browser-history/" },
        { title: "All O one Data Structure", difficulty: "Hard", link: "https://leetcode.com/problems/all-oone-data-structure/" },
        { title: "Plus One Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/plus-one-linked-list/" },
      ]},
      { name: "Sort/Merge in Linked List", count: 7, problems: [
        { title: "Sort List", difficulty: "Medium", link: "https://leetcode.com/problems/sort-list/" },
        { title: "Merge k Sorted Lists", difficulty: "Hard", link: "https://leetcode.com/problems/merge-k-sorted-lists/" },
        { title: "Insertion Sort List", difficulty: "Medium", link: "https://leetcode.com/problems/insertion-sort-list/" },
        { title: "Merge Two Sorted Lists", difficulty: "Easy", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
        { title: "Add Two Numbers II", difficulty: "Medium", link: "https://leetcode.com/problems/add-two-numbers-ii/" },
        { title: "Remove Nodes From Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/remove-nodes-from-linked-list/" },
        { title: "Double a Number Represented as Linked List", difficulty: "Medium", link: "https://leetcode.com/problems/double-a-number-represented-as-a-linked-list/" },
      ]},
    ]
  },
  {
    topic: "Stack", patterns: 4, total: 33,
    icon: "≡",
    subPatterns: [
      { name: "Basic Stack Problems", count: 7, problems: [
        { title: "Valid Parentheses", difficulty: "Easy", link: "https://leetcode.com/problems/valid-parentheses/" },
        { title: "Min Stack", difficulty: "Medium", link: "https://leetcode.com/problems/min-stack/" },
        { title: "Implement Queue using Stacks", difficulty: "Easy", link: "https://leetcode.com/problems/implement-queue-using-stacks/" },
        { title: "Implement Stack using Queues", difficulty: "Easy", link: "https://leetcode.com/problems/implement-stack-using-queues/" },
        { title: "Baseball Game", difficulty: "Easy", link: "https://leetcode.com/problems/baseball-game/" },
        { title: "Build an Array With Stack Operations", difficulty: "Medium", link: "https://leetcode.com/problems/build-an-array-with-stack-operations/" },
        { title: "Remove All Adjacent Duplicates In String", difficulty: "Easy", link: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/" },
      ]},
      { name: "Conversion/Expression Related Problems", count: 6, problems: [
        { title: "Evaluate Reverse Polish Notation", difficulty: "Medium", link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
        { title: "Basic Calculator", difficulty: "Hard", link: "https://leetcode.com/problems/basic-calculator/" },
        { title: "Basic Calculator II", difficulty: "Medium", link: "https://leetcode.com/problems/basic-calculator-ii/" },
        { title: "Decode String", difficulty: "Medium", link: "https://leetcode.com/problems/decode-string/" },
        { title: "Mini Parser", difficulty: "Medium", link: "https://leetcode.com/problems/mini-parser/" },
        { title: "Number of Atoms", difficulty: "Hard", link: "https://leetcode.com/problems/number-of-atoms/" },
      ]},
      { name: "Nested Structure Verification Problems", count: 8, problems: [
        { title: "Nested List Weight Sum", difficulty: "Medium", link: "https://leetcode.com/problems/nested-list-weight-sum/" },
        { title: "Flatten Nested List Iterator", difficulty: "Medium", link: "https://leetcode.com/problems/flatten-nested-list-iterator/" },
        { title: "Score of Parentheses", difficulty: "Medium", link: "https://leetcode.com/problems/score-of-parentheses/" },
        { title: "Remove Outermost Parentheses", difficulty: "Easy", link: "https://leetcode.com/problems/remove-outermost-parentheses/" },
        { title: "Minimum Remove to Make Valid Parentheses", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/" },
        { title: "Check if Word Is Valid After Substitutions", difficulty: "Medium", link: "https://leetcode.com/problems/check-if-word-is-valid-after-substitutions/" },
        { title: "Maximum Nesting Depth of Parentheses", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/" },
        { title: "Longest Valid Parentheses", difficulty: "Hard", link: "https://leetcode.com/problems/longest-valid-parentheses/" },
      ]},
      { name: "Hard Problems on Stack", count: 12, problems: [
        { title: "Daily Temperatures", difficulty: "Medium", link: "https://leetcode.com/problems/daily-temperatures/" },
        { title: "Next Greater Element I", difficulty: "Easy", link: "https://leetcode.com/problems/next-greater-element-i/" },
        { title: "Next Greater Element II", difficulty: "Medium", link: "https://leetcode.com/problems/next-greater-element-ii/" },
        { title: "Largest Rectangle in Histogram", difficulty: "Hard", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
        { title: "Maximal Rectangle", difficulty: "Hard", link: "https://leetcode.com/problems/maximal-rectangle/" },
        { title: "Trapping Rain Water", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/" },
        { title: "Sum of Subarray Minimums", difficulty: "Medium", link: "https://leetcode.com/problems/sum-of-subarray-minimums/" },
        { title: "132 Pattern", difficulty: "Medium", link: "https://leetcode.com/problems/132-pattern/" },
        { title: "Remove K Digits", difficulty: "Medium", link: "https://leetcode.com/problems/remove-k-digits/" },
        { title: "Create Maximum Number", difficulty: "Hard", link: "https://leetcode.com/problems/create-maximum-number/" },
        { title: "Maximum Width Ramp", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-width-ramp/" },
        { title: "Stock Span Problem", difficulty: "Medium", link: "https://leetcode.com/problems/online-stock-span/" },
      ]},
    ]
  },
  {
    topic: "Dynamic Programming", patterns: 12, total: 166,
    icon: "◈",
    subPatterns: [
      { name: "Linear DP", count: 29, problems: [
        { title: "Climbing Stairs", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/" },
        { title: "House Robber", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber/" },
        { title: "House Robber II", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber-ii/" },
        { title: "Decode Ways", difficulty: "Medium", link: "https://leetcode.com/problems/decode-ways/" },
        { title: "Jump Game", difficulty: "Medium", link: "https://leetcode.com/problems/jump-game/" },
        { title: "Jump Game II", difficulty: "Medium", link: "https://leetcode.com/problems/jump-game-ii/" },
        { title: "Maximum Subarray", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-subarray/" },
        { title: "Coin Change", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change/" },
        { title: "Coin Change II", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change-ii/" },
        { title: "Word Break", difficulty: "Medium", link: "https://leetcode.com/problems/word-break/" },
        { title: "Min Cost Climbing Stairs", difficulty: "Easy", link: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
        { title: "Fibonacci Number", difficulty: "Easy", link: "https://leetcode.com/problems/fibonacci-number/" },
        { title: "N-th Tribonacci Number", difficulty: "Easy", link: "https://leetcode.com/problems/n-th-tribonacci-number/" },
        { title: "Delete and Earn", difficulty: "Medium", link: "https://leetcode.com/problems/delete-and-earn/" },
        { title: "Maximum Product Subarray", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-product-subarray/" },
        { title: "Ugly Number II", difficulty: "Medium", link: "https://leetcode.com/problems/ugly-number-ii/" },
        { title: "Perfect Squares", difficulty: "Medium", link: "https://leetcode.com/problems/perfect-squares/" },
        { title: "Integer Break", difficulty: "Medium", link: "https://leetcode.com/problems/integer-break/" },
        { title: "Counting Bits", difficulty: "Easy", link: "https://leetcode.com/problems/counting-bits/" },
        { title: "Combination Sum IV", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum-iv/" },
        { title: "Minimum Cost For Tickets", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-cost-for-tickets/" },
        { title: "Domino and Tromino Tiling", difficulty: "Medium", link: "https://leetcode.com/problems/domino-and-tromino-tiling/" },
        { title: "Paint House", difficulty: "Medium", link: "https://leetcode.com/problems/paint-house/" },
        { title: "Paint House II", difficulty: "Hard", link: "https://leetcode.com/problems/paint-house-ii/" },
        { title: "Soup Servings", difficulty: "Medium", link: "https://leetcode.com/problems/soup-servings/" },
        { title: "Painting the Walls", difficulty: "Hard", link: "https://leetcode.com/problems/painting-the-walls/" },
        { title: "Solving Questions With Brainpower", difficulty: "Medium", link: "https://leetcode.com/problems/solving-questions-with-brainpower/" },
        { title: "Number of Ways to Stay in the Same Place After Some Steps", difficulty: "Hard", link: "https://leetcode.com/problems/number-of-ways-to-stay-in-the-same-place-after-some-steps/" },
        { title: "Number of Ways to Form a Target String", difficulty: "Hard", link: "https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/" },
      ]},
      { name: "Knapsack", count: 11, problems: [
        { title: "Partition Equal Subset Sum", difficulty: "Medium", link: "https://leetcode.com/problems/partition-equal-subset-sum/" },
        { title: "Target Sum", difficulty: "Medium", link: "https://leetcode.com/problems/target-sum/" },
        { title: "Last Stone Weight II", difficulty: "Medium", link: "https://leetcode.com/problems/last-stone-weight-ii/" },
        { title: "Ones and Zeroes", difficulty: "Medium", link: "https://leetcode.com/problems/ones-and-zeroes/" },
        { title: "Profitable Schemes", difficulty: "Hard", link: "https://leetcode.com/problems/profitable-schemes/" },
        { title: "Number of Ways to Earn Points", difficulty: "Hard", link: "https://leetcode.com/problems/number-of-ways-to-earn-points/" },
        { title: "Coin Change II", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change-ii/" },
        { title: "Combination Sum IV", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum-iv/" },
        { title: "Form Largest Integer With Digits That Add up to Target", difficulty: "Hard", link: "https://leetcode.com/problems/form-largest-integer-with-digits-that-add-up-to-target/" },
        { title: "Number of Dice Rolls With Target Sum", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-dice-rolls-with-target-sum/" },
        { title: "0/1 Knapsack", difficulty: "Medium", link: "https://leetcode.com/problems/partition-equal-subset-sum/" },
      ]},
      { name: "DP on Strings", count: 23, problems: [
        { title: "Longest Common Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-common-subsequence/" },
        { title: "Edit Distance", difficulty: "Medium", link: "https://leetcode.com/problems/edit-distance/" },
        { title: "Distinct Subsequences", difficulty: "Hard", link: "https://leetcode.com/problems/distinct-subsequences/" },
        { title: "Interleaving String", difficulty: "Medium", link: "https://leetcode.com/problems/interleaving-string/" },
        { title: "Regular Expression Matching", difficulty: "Hard", link: "https://leetcode.com/problems/regular-expression-matching/" },
        { title: "Wildcard Matching", difficulty: "Hard", link: "https://leetcode.com/problems/wildcard-matching/" },
        { title: "Word Break", difficulty: "Medium", link: "https://leetcode.com/problems/word-break/" },
        { title: "Palindrome Partitioning II", difficulty: "Hard", link: "https://leetcode.com/problems/palindrome-partitioning-ii/" },
        { title: "Longest Palindromic Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-palindromic-subsequence/" },
        { title: "Shortest Common Supersequence", difficulty: "Hard", link: "https://leetcode.com/problems/shortest-common-supersequence/" },
        { title: "Minimum ASCII Delete Sum for Two Strings", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/" },
        { title: "Uncrossed Lines", difficulty: "Medium", link: "https://leetcode.com/problems/uncrossed-lines/" },
        { title: "Maximum Length of Repeated Subarray", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-length-of-repeated-subarray/" },
        { title: "Count Vowels Permutation", difficulty: "Hard", link: "https://leetcode.com/problems/count-vowels-permutation/" },
        { title: "Strange Printer", difficulty: "Hard", link: "https://leetcode.com/problems/strange-printer/" },
        { title: "Longest String Chain", difficulty: "Medium", link: "https://leetcode.com/problems/longest-string-chain/" },
        { title: "Scramble String", difficulty: "Hard", link: "https://leetcode.com/problems/scramble-string/" },
        { title: "Count Different Palindromic Subsequences", difficulty: "Hard", link: "https://leetcode.com/problems/count-different-palindromic-subsequences/" },
        { title: "Zuma Game", difficulty: "Hard", link: "https://leetcode.com/problems/zuma-game/" },
        { title: "Minimum Number of Insertions to Make String Palindrome", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/" },
        { title: "Encode String with Shortest Length", difficulty: "Hard", link: "https://leetcode.com/problems/encode-string-with-shortest-length/" },
        { title: "Stone Game V", difficulty: "Hard", link: "https://leetcode.com/problems/stone-game-v/" },
        { title: "Number of Ways to Form Target", difficulty: "Hard", link: "https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/" },
      ]},
      { name: "DP on LIS", count: 7, problems: [
        { title: "Longest Increasing Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-increasing-subsequence/" },
        { title: "Russian Doll Envelopes", difficulty: "Hard", link: "https://leetcode.com/problems/russian-doll-envelopes/" },
        { title: "Maximum Length of Pair Chain", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-length-of-pair-chain/" },
        { title: "Longest Arithmetic Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-arithmetic-subsequence/" },
        { title: "Number of Longest Increasing Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-longest-increasing-subsequence/" },
        { title: "Increasing Triplet Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/increasing-triplet-subsequence/" },
        { title: "Longest Ideal Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-ideal-subsequence/" },
      ]},
    ]
  },
  {
    topic: "Tree", patterns: 12, total: 73,
    icon: "⑂",
    subPatterns: [
      { name: "Level Order Traversal & BFS Variants", count: 15, problems: [
        { title: "Binary Tree Level Order Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
        { title: "Binary Tree Zigzag Level Order Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" },
        { title: "Binary Tree Level Order Traversal II", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-level-order-traversal-ii/" },
        { title: "Average of Levels in Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/average-of-levels-in-binary-tree/" },
        { title: "N-ary Tree Level Order Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/n-ary-tree-level-order-traversal/" },
        { title: "Find Largest Value in Each Tree Row", difficulty: "Medium", link: "https://leetcode.com/problems/find-largest-value-in-each-tree-row/" },
        { title: "Populating Next Right Pointers", difficulty: "Medium", link: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/" },
        { title: "Binary Tree Right Side View", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-right-side-view/" },
        { title: "Maximum Width of Binary Tree", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-width-of-binary-tree/" },
        { title: "Minimum Depth of Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/minimum-depth-of-binary-tree/" },
        { title: "Check Completeness of a Binary Tree", difficulty: "Medium", link: "https://leetcode.com/problems/check-completeness-of-a-binary-tree/" },
        { title: "Cousins in Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/cousins-in-binary-tree/" },
        { title: "Even Odd Tree", difficulty: "Medium", link: "https://leetcode.com/problems/even-odd-tree/" },
        { title: "Deepest Leaves Sum", difficulty: "Medium", link: "https://leetcode.com/problems/deepest-leaves-sum/" },
        { title: "Maximum Level Sum of a Binary Tree", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/" },
      ]},
      { name: "Root-to-Leaf Path Problems", count: 6, problems: [
        { title: "Path Sum", difficulty: "Easy", link: "https://leetcode.com/problems/path-sum/" },
        { title: "Path Sum II", difficulty: "Medium", link: "https://leetcode.com/problems/path-sum-ii/" },
        { title: "Path Sum III", difficulty: "Medium", link: "https://leetcode.com/problems/path-sum-iii/" },
        { title: "Binary Tree Maximum Path Sum", difficulty: "Hard", link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
        { title: "Sum Root to Leaf Numbers", difficulty: "Medium", link: "https://leetcode.com/problems/sum-root-to-leaf-numbers/" },
        { title: "Smallest String Starting From Leaf", difficulty: "Medium", link: "https://leetcode.com/problems/smallest-string-starting-from-leaf/" },
      ]},
      { name: "Tree Construction", count: 10, problems: [
        { title: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", link: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
        { title: "Construct Binary Tree from Inorder and Postorder", difficulty: "Medium", link: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/" },
        { title: "Convert Sorted Array to Binary Search Tree", difficulty: "Easy", link: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/" },
        { title: "Convert Sorted List to Binary Search Tree", difficulty: "Medium", link: "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/" },
        { title: "Construct Binary Search Tree from Preorder Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/" },
        { title: "Maximum Binary Tree", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-binary-tree/" },
        { title: "All Possible Full Binary Trees", difficulty: "Medium", link: "https://leetcode.com/problems/all-possible-full-binary-trees/" },
        { title: "Unique Binary Search Trees", difficulty: "Medium", link: "https://leetcode.com/problems/unique-binary-search-trees/" },
        { title: "Unique Binary Search Trees II", difficulty: "Medium", link: "https://leetcode.com/problems/unique-binary-search-trees-ii/" },
        { title: "Recover Binary Search Tree", difficulty: "Medium", link: "https://leetcode.com/problems/recover-binary-search-tree/" },
      ]},
      { name: "Depth Related", count: 4, problems: [
        { title: "Maximum Depth of Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
        { title: "Minimum Depth of Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/minimum-depth-of-binary-tree/" },
        { title: "Balanced Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/balanced-binary-tree/" },
        { title: "Diameter of Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/diameter-of-binary-tree/" },
      ]},
    ]
  },
  {
    topic: "Greedy", patterns: 6, total: 60,
    icon: "★",
    subPatterns: [
      { name: "Greedy with Sorting + Two Pointers", count: 10, problems: [
        { title: "Assign Cookies", difficulty: "Easy", link: "https://leetcode.com/problems/assign-cookies/" },
        { title: "Boats to Save People", difficulty: "Medium", link: "https://leetcode.com/problems/boats-to-save-people/" },
        { title: "Two City Scheduling", difficulty: "Medium", link: "https://leetcode.com/problems/two-city-scheduling/" },
        { title: "Largest Number", difficulty: "Medium", link: "https://leetcode.com/problems/largest-number/" },
        { title: "Minimum Number of Arrows to Burst Balloons", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" },
        { title: "Non-overlapping Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/non-overlapping-intervals/" },
        { title: "Meeting Rooms II", difficulty: "Medium", link: "https://leetcode.com/problems/meeting-rooms-ii/" },
        { title: "Task Scheduler", difficulty: "Medium", link: "https://leetcode.com/problems/task-scheduler/" },
        { title: "Car Pooling", difficulty: "Medium", link: "https://leetcode.com/problems/car-pooling/" },
        { title: "Minimum Platforms", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" },
      ]},
      { name: "One-Pass Greedy", count: 10, problems: [
        { title: "Jump Game", difficulty: "Medium", link: "https://leetcode.com/problems/jump-game/" },
        { title: "Jump Game II", difficulty: "Medium", link: "https://leetcode.com/problems/jump-game-ii/" },
        { title: "Gas Station", difficulty: "Medium", link: "https://leetcode.com/problems/gas-station/" },
        { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
        { title: "Best Time to Buy and Sell Stock II", difficulty: "Medium", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/" },
        { title: "Candy", difficulty: "Hard", link: "https://leetcode.com/problems/candy/" },
        { title: "Lemonade Change", difficulty: "Easy", link: "https://leetcode.com/problems/lemonade-change/" },
        { title: "Queue Reconstruction by Height", difficulty: "Medium", link: "https://leetcode.com/problems/queue-reconstruction-by-height/" },
        { title: "Partition Labels", difficulty: "Medium", link: "https://leetcode.com/problems/partition-labels/" },
        { title: "Maximum Subarray", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-subarray/" },
      ]},
    ]
  },
  {
    topic: "Backtracking", patterns: 3, total: 22,
    icon: "↺",
    subPatterns: [
      { name: "Subsets/Permutations/Combinations", count: 8, problems: [
        { title: "Subsets", difficulty: "Medium", link: "https://leetcode.com/problems/subsets/" },
        { title: "Subsets II", difficulty: "Medium", link: "https://leetcode.com/problems/subsets-ii/" },
        { title: "Permutations", difficulty: "Medium", link: "https://leetcode.com/problems/permutations/" },
        { title: "Permutations II", difficulty: "Medium", link: "https://leetcode.com/problems/permutations-ii/" },
        { title: "Combinations", difficulty: "Medium", link: "https://leetcode.com/problems/combinations/" },
        { title: "Combination Sum", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum/" },
        { title: "Combination Sum II", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum-ii/" },
        { title: "Combination Sum III", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum-iii/" },
      ]},
      { name: "Array & String Based Problems", count: 7, problems: [
        { title: "Letter Combinations of a Phone Number", difficulty: "Medium", link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
        { title: "Generate Parentheses", difficulty: "Medium", link: "https://leetcode.com/problems/generate-parentheses/" },
        { title: "Palindrome Partitioning", difficulty: "Medium", link: "https://leetcode.com/problems/palindrome-partitioning/" },
        { title: "Restore IP Addresses", difficulty: "Medium", link: "https://leetcode.com/problems/restore-ip-addresses/" },
        { title: "Word Search", difficulty: "Medium", link: "https://leetcode.com/problems/word-search/" },
        { title: "N-Queens", difficulty: "Hard", link: "https://leetcode.com/problems/n-queens/" },
        { title: "Sudoku Solver", difficulty: "Hard", link: "https://leetcode.com/problems/sudoku-solver/" },
      ]},
      { name: "Matrix Based Problems", count: 7, problems: [
        { title: "Word Search II", difficulty: "Hard", link: "https://leetcode.com/problems/word-search-ii/" },
        { title: "Unique Paths III", difficulty: "Hard", link: "https://leetcode.com/problems/unique-paths-iii/" },
        { title: "Flood Fill", difficulty: "Easy", link: "https://leetcode.com/problems/flood-fill/" },
        { title: "Pacific Atlantic Water Flow", difficulty: "Medium", link: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
        { title: "Number of Increasing Paths in Grid", difficulty: "Hard", link: "https://leetcode.com/problems/number-of-increasing-paths-in-a-grid/" },
        { title: "Knight Minimum Moves", difficulty: "Medium", link: "https://leetcode.com/problems/minimum-knight-moves/" },
        { title: "Rat in a Maze", difficulty: "Medium", link: "https://leetcode.com/problems/unique-paths-iii/" },
      ]},
    ]
  },
]

const diffColor: Record<string, string> = {
  Easy: "bg-green-500/20 text-green-400 border-green-500/20",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  Hard: "bg-red-500/20 text-red-400 border-red-500/20",
}

const topicColors = [
  "bg-blue-500/20 text-blue-400",
  "bg-purple-500/20 text-purple-400",
  "bg-orange-500/20 text-orange-400",
  "bg-yellow-500/20 text-yellow-400",
  "bg-indigo-500/20 text-indigo-400",
  "bg-pink-500/20 text-pink-400",
  "bg-amber-500/20 text-amber-400",
  "bg-red-500/20 text-red-400",
  "bg-green-500/20 text-green-400",
  "bg-cyan-500/20 text-cyan-400",
]

const DAILY_PROBLEMS = [
  { title: "Two Sum", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/" },
  { title: "Valid Palindrome", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/" },
  { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { title: "3Sum", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/" },
  { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { title: "Coin Change", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change/" },
  { title: "Number of Islands", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-islands/" },
  { title: "Trapping Rain Water", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/" },
  { title: "Climbing Stairs", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/" },
  { title: "LRU Cache", difficulty: "Medium", link: "https://leetcode.com/problems/lru-cache/" },
  { title: "Maximum Subarray", difficulty: "Medium", link: "https://leetcode.com/problems/maximum-subarray/" },
  { title: "Search in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { title: "Container With Most Water", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/" },
  { title: "House Robber", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber/" },
  { title: "Merge Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/merge-intervals/" },
  { title: "Word Break", difficulty: "Medium", link: "https://leetcode.com/problems/word-break/" },
  { title: "Reverse Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-linked-list/" },
  { title: "Valid Parentheses", difficulty: "Easy", link: "https://leetcode.com/problems/valid-parentheses/" },
  { title: "Kth Largest Element in Array", difficulty: "Medium", link: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { title: "Product of Array Except Self", difficulty: "Medium", link: "https://leetcode.com/problems/product-of-array-except-self/" },
  { title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { title: "Minimum Window Substring", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-window-substring/" },
  { title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
  { title: "Longest Increasing Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-increasing-subsequence/" },
  { title: "Jump Game", difficulty: "Medium", link: "https://leetcode.com/problems/jump-game/" },
  { title: "Combination Sum", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum/" },
  { title: "Subsets", difficulty: "Medium", link: "https://leetcode.com/problems/subsets/" },
  { title: "Rotate Image", difficulty: "Medium", link: "https://leetcode.com/problems/rotate-image/" },
  { title: "Group Anagrams", difficulty: "Medium", link: "https://leetcode.com/problems/group-anagrams/" },
  { title: "Daily Temperatures", difficulty: "Medium", link: "https://leetcode.com/problems/daily-temperatures/" },
  { title: "Largest Rectangle in Histogram", difficulty: "Hard", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
]

function getTodayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

function getDailyProblem() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return DAILY_PROBLEMS[dayOfYear % DAILY_PROBLEMS.length]
}

function buildYearHeatmap(submissionCounts: Record<string, number>) {
  const cells: { date: string; count: number; month: number; week: number; dayOfWeek: number }[] = []
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 364)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  let weekIdx = 0
  const cur = new Date(startDate)
  while (cur <= today) {
    const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`
    cells.push({
      date: key,
      count: submissionCounts[key] || 0,
      month: cur.getMonth(),
      week: weekIdx,
      dayOfWeek: cur.getDay(),
    })
    cur.setDate(cur.getDate() + 1)
    if (cur.getDay() === 0) weekIdx++
  }
  return { cells, totalWeeks: weekIdx + 1 }
}

function getHeatmapLevel(count: number) {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 5) return 3
  return 4
}

function computeStreakStats(submissionCounts: Record<string, number>) {
  const activeKeys = Object.keys(submissionCounts)
    .filter((key) => (submissionCounts[key] || 0) > 0)
    .sort()

  if (activeKeys.length === 0) {
    return { currentStreak: 0, maxStreak: 0, activeDays: 0, totalSubmissions: 0 }
  }

  let maxStreak = 1
  let running = 1

  for (let i = 1; i < activeKeys.length; i += 1) {
    const prev = new Date(activeKeys[i - 1])
    const curr = new Date(activeKeys[i])
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      running += 1
      maxStreak = Math.max(maxStreak, running)
    } else {
      running = 1
    }
  }

  let currentStreak = 0
  const walk = new Date()
  while (true) {
    const key = `${walk.getFullYear()}-${String(walk.getMonth() + 1).padStart(2, "0")}-${String(walk.getDate()).padStart(2, "0")}`
    if ((submissionCounts[key] || 0) > 0) {
      currentStreak += 1
      walk.setDate(walk.getDate() - 1)
    } else {
      break
    }
  }

  const totalSubmissions = Object.values(submissionCounts).reduce((sum, value) => sum + value, 0)

  return {
    currentStreak,
    maxStreak,
    activeDays: activeKeys.length,
    totalSubmissions,
  }
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const HEATMAP_DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]
const HEATMAP_CELL_SIZE = 13
const HEATMAP_GRID_GAP = 4
const HEATMAP_MONTH_GAP = 10
const HEATMAP_LEVEL_STYLES = [
  "bg-[#261a36] hover:bg-[#312046]",
  "bg-[#4c1d95]/70 hover:bg-[#5b21b6]/80",
  "bg-[#6d28d9]/80 hover:bg-[#7c3aed]/85",
  "bg-[#8b5cf6]/85 hover:bg-[#9f67ff]/90",
  "bg-[#c084fc] hover:bg-[#d8a4ff]",
]

type View = "home" | "topic" | "pattern"
interface SelectedPattern { topic: typeof SHEET_DATA[0]; subPattern: typeof SHEET_DATA[0]["subPatterns"][0] }

export default function PracticePage() {
  const [view, setView] = useState<View>("home")
  const [selectedTopic, setSelectedTopic] = useState<typeof SHEET_DATA[0] | null>(null)
  const [selectedPattern, setSelectedPattern] = useState<SelectedPattern | null>(null)
  const [solved, setSolved] = useState<Record<string, boolean>>({})
  const [solvedDates, setSolvedDates] = useState<Record<string, string>>({})
  const [dailyDone, setDailyDone] = useState(false)
  const [history, setHistory] = useState<Record<string, boolean>>({})
  const [submissionCounts, setSubmissionCounts] = useState<Record<string, number>>({})

  const dailyProblem = getDailyProblem()

  useEffect(() => {
    const savedSolved = JSON.parse(localStorage.getItem("lc_solved") || "{}")
    const savedSolvedDates = JSON.parse(localStorage.getItem("lc_solved_dates") || "{}")
    const savedHistory = JSON.parse(localStorage.getItem("daily_history") || "{}")
    const savedSubmissionCounts = JSON.parse(localStorage.getItem("practice_submission_counts") || "{}")
    const seededCounts = Object.keys(savedSubmissionCounts).length > 0
      ? savedSubmissionCounts
      : Object.fromEntries(
          Object.entries(savedHistory)
            .filter(([, done]) => done === true)
            .map(([key]) => [key, 1])
        )
    setSolved(savedSolved)
    setSolvedDates(savedSolvedDates)
    setHistory(savedHistory)
    setSubmissionCounts(seededCounts)
    setDailyDone(savedHistory[getTodayKey()] === true)
  }, [])

  const toggleSolved = (problemKey: string) => {
    const isSolved = !!solved[problemKey]
    const todayKey = getTodayKey()
    const recordedDate = solvedDates[problemKey]
    const nextSolved = !isSolved
    const newSolved = { ...solved, [problemKey]: nextSolved }
    const newSolvedDates = { ...solvedDates }
    const newSubmissionCounts = { ...submissionCounts }

    if (nextSolved) {
      newSolvedDates[problemKey] = todayKey
      newSubmissionCounts[todayKey] = (newSubmissionCounts[todayKey] || 0) + 1
    } else if (recordedDate) {
      newSubmissionCounts[recordedDate] = Math.max((newSubmissionCounts[recordedDate] || 1) - 1, 0)
      if (newSubmissionCounts[recordedDate] === 0) {
        delete newSubmissionCounts[recordedDate]
      }
      delete newSolvedDates[problemKey]
    }

    setSolved(newSolved)
    setSolvedDates(newSolvedDates)
    setSubmissionCounts(newSubmissionCounts)
    localStorage.setItem("lc_solved", JSON.stringify(newSolved))
    localStorage.setItem("lc_solved_dates", JSON.stringify(newSolvedDates))
    localStorage.setItem("practice_submission_counts", JSON.stringify(newSubmissionCounts))
  }

  const getSubPatternProgress = (topic: string, spName: string, count: number) => {
    const done = Array.from({ length: count }, (_, i) => solved[`${topic}__${spName}__${i}`]).filter(Boolean).length
    return { done, total: count, pct: Math.round((done / count) * 100) }
  }

  const getTopicProgress = (topic: typeof SHEET_DATA[0]) => {
    const done = topic.subPatterns.reduce((acc, sp) => {
      return acc + Array.from({ length: sp.count }, (_, i) => solved[`${topic.topic}__${sp.name}__${i}`]).filter(Boolean).length
    }, 0)
    return { done, total: topic.total, pct: Math.round((done / topic.total) * 100) }
  }

  const totalSolved = SHEET_DATA.reduce((acc, t) => acc + getTopicProgress(t).done, 0)
  const grandTotal = SHEET_DATA.reduce((a, b) => a + b.total, 0)
  const stats = useMemo(() => computeStreakStats(submissionCounts), [submissionCounts])

  const markDailyDone = () => {
    if (dailyDone) return
    const todayKey = getTodayKey()
    const newHistory = { ...history, [todayKey]: true }
    const newSubmissionCounts = { ...submissionCounts, [todayKey]: (submissionCounts[todayKey] || 0) + 1 }
    setDailyDone(true)
    setHistory(newHistory)
    setSubmissionCounts(newSubmissionCounts)
    localStorage.setItem("daily_history", JSON.stringify(newHistory))
    localStorage.setItem("practice_submission_counts", JSON.stringify(newSubmissionCounts))
  }

  const { cells, totalWeeks } = buildYearHeatmap(submissionCounts)
  const heatmapCellMap = useMemo(() => {
    return new Map(cells.map((cell) => [`${cell.week}-${cell.dayOfWeek}`, cell]))
  }, [cells])

  // Month labels
  const monthLabels: { month: number; week: number }[] = []
  let lastMonth = -1
  cells.forEach(c => {
    if (c.dayOfWeek === 0 && c.month !== lastMonth) {
      monthLabels.push({ month: c.month, week: c.week })
      lastMonth = c.month
    }
  })
  const monthStartWeeks = useMemo(() => new Set(monthLabels.map((label) => label.week).filter((week) => week > 0)), [monthLabels])
  const weekOffsets = useMemo(() => {
    const offsets: number[] = []
    let currentOffset = 0

    for (let week = 0; week < totalWeeks; week += 1) {
      offsets.push(currentOffset)
      currentOffset += HEATMAP_CELL_SIZE + HEATMAP_GRID_GAP
      if (monthStartWeeks.has(week + 1)) currentOffset += HEATMAP_MONTH_GAP
    }

    offsets.push(currentOffset)
    return offsets
  }, [monthStartWeeks, totalWeeks])

  // PATTERN VIEW
  if (view === "pattern" && selectedPattern) {
    const { topic, subPattern } = selectedPattern
    const progress = getSubPatternProgress(topic.topic, subPattern.name, subPattern.problems.length)
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("topic")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">{topic.topic}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-foreground font-medium">{subPattern.name}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{subPattern.name}</h2>
          <p className="text-muted-foreground mt-1">{progress.done} of {subPattern.problems.length} problems solved</p>
        </div>
        <div className="glass-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-bold text-primary">{progress.pct}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-primary rounded-full h-2 transition-all duration-500" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          {subPattern.problems.map((problem, i) => {
            const key = `${topic.topic}__${subPattern.name}__${i}`
            const isSolved = solved[key]
            return (
              <div key={i} className={cn(
                "glass-card rounded-xl border p-4 flex items-center justify-between gap-4 transition-all",
                isSolved ? "border-green-500/20 bg-green-500/5" : "border-border hover:border-primary/20"
              )}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button onClick={() => toggleSolved(key)}
                    className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                      isSolved ? "bg-green-500 border-green-500" : "border-muted-foreground hover:border-primary"
                    )}>
                    {isSolved && <CheckCircle className="w-3 h-3 text-white" />}
                  </button>
                  <span className={cn("text-sm font-medium truncate", isSolved ? "line-through text-muted-foreground" : "text-foreground")}>
                    {problem.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", diffColor[problem.difficulty])}>
                    {problem.difficulty}
                  </span>
                  <a href={problem.link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20">
                    Solve <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // TOPIC VIEW
  if (view === "topic" && selectedTopic) {
    const topicProg = getTopicProgress(selectedTopic)
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("home")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Pattern Sheets
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-foreground font-medium">{selectedTopic.topic}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">CURRICULUM › PATTERNS</p>
            <h2 className="text-3xl font-bold text-foreground">
              Tactical <span className="text-primary">Patterns</span>
            </h2>
            <p className="text-muted-foreground mt-1">{selectedTopic.patterns} patterns — work through each to build complete mastery.</p>
          </div>
          <div className="glass-card rounded-xl border border-border px-5 py-3 text-right">
            <div className="text-xl font-bold text-primary">{topicProg.pct}%<span className="text-muted-foreground text-sm font-normal"> overall</span></div>
            <div className="w-32 bg-secondary rounded-full h-1.5 mt-1">
              <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${topicProg.pct}%` }} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedTopic.subPatterns.map((sp, i) => {
            const prog = getSubPatternProgress(selectedTopic.topic, sp.name, sp.problems.length)
            return (
              <div key={i} className="glass-card rounded-xl border border-border p-5 hover:border-primary/30 transition-all cursor-pointer group"
                onClick={() => { setSelectedPattern({ topic: selectedTopic, subPattern: sp }); setView("pattern") }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Play className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">{prog.done}/{sp.count} solved</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{sp.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{sp.count} problems</p>
                <div className="w-full bg-secondary rounded-full h-1.5 mb-1">
                  <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${prog.pct}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{prog.pct}% complete</span>
                  <span className="text-xs text-primary font-medium group-hover:underline flex items-center gap-1">
                    Start Pattern <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // HOME VIEW
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            Daily Practice
          </h2>
          <p className="text-muted-foreground mt-1">Pattern-Wise Mastery — {SHEET_DATA.length} topics, {grandTotal} problems</p>
        </div>
        <div className="glass-card rounded-xl border border-border px-5 py-3 text-right">
          <div className="text-2xl font-bold text-primary">{totalSolved}<span className="text-muted-foreground text-base font-normal">/{grandTotal}</span></div>
          <div className="text-xs text-muted-foreground">Total Solved</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] border border-[#8b5cf6]/20 bg-[linear-gradient(180deg,rgba(109,40,217,0.12)_0%,rgba(18,13,29,0.9)_100%)] p-4 text-center shadow-[0_14px_34px_rgba(76,29,149,0.12)]">
          <div className="mb-1 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8b5cf6]/15">
              <Flame className="h-5 w-5 text-[#c084fc]" />
            </div>
            <span className="text-2xl font-bold text-violet-50">{stats.currentStreak}</span>
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-violet-100/55">Current Streak</p>
        </div>
        <div className="rounded-[24px] border border-[#8b5cf6]/20 bg-[linear-gradient(180deg,rgba(109,40,217,0.12)_0%,rgba(18,13,29,0.9)_100%)] p-4 text-center shadow-[0_14px_34px_rgba(76,29,149,0.12)]">
          <div className="mb-1 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8b5cf6]/15">
              <Trophy className="h-5 w-5 text-[#c084fc]" />
            </div>
            <span className="text-2xl font-bold text-violet-50">{totalSolved}</span>
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-violet-100/55">Problems Solved</p>
        </div>
        <div className="rounded-[24px] border border-[#8b5cf6]/20 bg-[linear-gradient(180deg,rgba(109,40,217,0.12)_0%,rgba(18,13,29,0.9)_100%)] p-4 text-center shadow-[0_14px_34px_rgba(76,29,149,0.12)]">
          <div className="mb-1 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8b5cf6]/15">
              <Target className="h-5 w-5 text-[#c084fc]" />
            </div>
            <span className="text-2xl font-bold text-violet-50">{stats.activeDays}</span>
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-violet-100/55">Active Days</p>
        </div>
      </div>

      {/* GitHub-style Yearly Heatmap */}
      <div className="overflow-hidden rounded-[28px] border border-[#8b5cf6]/20 bg-[linear-gradient(180deg,#161022_0%,#120d1d_100%)] px-4 py-5 shadow-[0_20px_60px_rgba(76,29,149,0.18)] sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-2 text-[15px] font-semibold text-violet-50 sm:text-[18px]">
            <span className="text-3xl font-black tracking-tight text-white sm:text-[42px]">{stats.totalSubmissions}</span>
            <span className="leading-none text-violet-100/80">submissions in the past one year</span>
            <Info className="h-4 w-4 text-violet-300/40" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
            <div className="flex items-center gap-6 text-sm text-violet-100/60">
              <span>Total active days: <span className="font-semibold text-violet-50">{stats.activeDays}</span></span>
              <span>Max streak: <span className="font-semibold text-violet-50">{stats.maxStreak}</span></span>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-between gap-3 rounded-xl border border-[#8b5cf6]/20 bg-[#ffffff08] px-4 py-2.5 text-sm font-medium text-violet-50 shadow-sm transition-colors hover:bg-[#ffffff12]"
            >
              Current
              <ChevronDown className="h-4 w-4 text-violet-200/60" />
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto pb-1">
          <div className="min-w-max">
            <div className="ml-8 flex">
              {monthLabels.map((label, index) => (
                <div
                  key={`${label.month}-${label.week}`}
                  className="text-xs font-medium text-violet-100/60"
                  style={{
                    width: `${weekOffsets[index < monthLabels.length - 1 ? monthLabels[index + 1].week : totalWeeks] - weekOffsets[label.week]}px`,
                    paddingLeft: monthStartWeeks.has(label.week) ? `${HEATMAP_MONTH_GAP}px` : "0px",
                  }}
                >
                  {MONTH_NAMES[label.month]}
                </div>
              ))}
            </div>

            <div className="mt-2 flex gap-2">
              <div className="flex flex-col gap-1 pr-1">
                {HEATMAP_DAY_LABELS.map((day, index) => (
                  <div key={`${day}-${index}`} className="flex h-[13px] w-5 items-center text-[10px] font-medium text-violet-200/35">
                    {day}
                  </div>
                ))}
              </div>

              <div className="flex gap-1">
                {Array.from({ length: totalWeeks }, (_, week) => (
                  <div
                    key={week}
                    className="flex flex-col gap-1"
                    style={{ marginLeft: monthStartWeeks.has(week) ? `${HEATMAP_MONTH_GAP}px` : "0px" }}
                  >
                    {Array.from({ length: 7 }, (_, day) => {
                      const cell = heatmapCellMap.get(`${week}-${day}`)
                      if (!cell) return <div key={day} className="h-[13px] w-[13px]" />

                      const level = getHeatmapLevel(cell.count)
                      const isToday = cell.date === getTodayKey()

                      return (
                        <div
                          key={day}
                          title={`${cell.date}${cell.count > 0 ? ` • ${cell.count} submission${cell.count > 1 ? "s" : ""}` : ""}`}
                          className={cn(
                            "h-[13px] w-[13px] rounded-[3px] border border-transparent transition-all",
                            HEATMAP_LEVEL_STYLES[level],
                            isToday && "border-violet-200/90 ring-1 ring-violet-300/40"
                          )}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 text-xs text-violet-100/60">
              <span>Less</span>
              {HEATMAP_LEVEL_STYLES.map((color, index) => (
                <div key={index} className={cn("h-[13px] w-[13px] rounded-[3px]", color)} />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Problem */}
      <div className="rounded-[28px] border border-[#8b5cf6]/20 bg-[linear-gradient(180deg,rgba(109,40,217,0.14)_0%,rgba(18,13,29,0.96)_100%)] p-5 shadow-[0_18px_48px_rgba(76,29,149,0.14)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8b5cf6]/20 bg-[#8b5cf6]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d8b4fe]">
              <Sparkles className="w-3.5 h-3.5" />
              Daily Problem
            </div>
            <h3 className="mt-4 text-2xl font-black text-violet-50">{dailyProblem.title}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", diffColor[dailyProblem.difficulty])}>
                {dailyProblem.difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8b5cf6]/16 bg-[#ffffff08] px-2.5 py-1 text-xs text-violet-100/70">
                <CalendarDays className="w-3.5 h-3.5" />
                {dailyDone ? "Completed today" : "Not solved yet"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8b5cf6]/16 bg-[#ffffff08] px-2.5 py-1 text-xs text-violet-100/70">
                <Activity className="w-3.5 h-3.5" />
                {stats.totalSubmissions} tracked submissions
              </span>
            </div>
    
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[360px]">
            <div className="rounded-2xl border border-[#8b5cf6]/16 bg-[#ffffff08] px-4 py-3 text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-violet-100/50">Current</p>
              <p className="mt-2 text-2xl font-black text-violet-50">{stats.currentStreak}</p>
            </div>
            <div className="rounded-2xl border border-[#8b5cf6]/16 bg-[#ffffff08] px-4 py-3 text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-violet-100/50">Max</p>
              <p className="mt-2 text-2xl font-black text-violet-50">{stats.maxStreak}</p>
            </div>
            <div className="rounded-2xl border border-[#8b5cf6]/16 bg-[#ffffff08] px-4 py-3 text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-violet-100/50">Active Days</p>
              <p className="mt-2 text-2xl font-black text-violet-50">{stats.activeDays}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={dailyProblem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl gradient-purple px-4 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            Solve on LeetCode <ExternalLink className="w-4 h-4" />
          </a>
          {!dailyDone ? (
            <button
              onClick={markDailyDone}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#8b5cf6]/22 bg-[#8b5cf6]/14 px-4 py-3 text-sm font-medium text-[#e9d5ff] hover:bg-[#8b5cf6]/22"
            >
              <CheckCircle className="w-4 h-4" /> Mark as Solved
            </button>
          ) : (
            <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#8b5cf6]/22 bg-[#8b5cf6]/14 px-4 py-3 text-sm font-medium text-[#e9d5ff]">
              <CheckCircle className="w-4 h-4" /> Come back tomorrow for a new one
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Collections Grid */}
      <div>
        <div className="mb-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">ALGORITHM COLLECTIONS</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-foreground">
              Pattern-Wise <span className="text-primary">Mastery</span>
            </h3>
            <span className="text-sm text-muted-foreground font-medium">{SHEET_DATA.length} topics</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SHEET_DATA.map((sheet, idx) => {
            const prog = getTopicProgress(sheet)
            const colorClass = topicColors[idx % topicColors.length]
            return (
              <div key={sheet.topic}
                onClick={() => { setSelectedTopic(sheet); setView("topic") }}
                className="glass-card rounded-xl border border-border p-4 hover:border-primary/40 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold", colorClass)}>
                    {sheet.icon}
                  </div>
                  <span className="text-xs text-muted-foreground">{prog.done}/{sheet.total}</span>
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors leading-tight">{sheet.topic}</h4>
                <p className="text-xs text-muted-foreground mb-3">{sheet.patterns} patterns</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">PROGRESS</span>
                    <span className="text-xs text-muted-foreground">{prog.pct}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1">
                    <div className={cn("rounded-full h-1 transition-all", prog.pct > 0 ? "bg-primary" : "bg-secondary")}
                      style={{ width: `${prog.pct}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
