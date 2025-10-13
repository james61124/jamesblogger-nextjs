"use client";

import React, { useState } from 'react';
import { Check, BookOpen, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const TopicRoadmap = () => {
  const [completedItems, setCompletedItems] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set(['string', 'array'])); // Default expanded

  const roadmapData = [
    {
      id: 'two-pointers',
      title: 'Two Pointers & Sliding Window',
      color: 'bg-blue-500',
      description: 'Pointer techniques and window optimization',
      items: [
        { id: 'two-pointers', title: '[ Algorithm ] Two Pointers | 核心概念與 Leetcode 題型解析', difficulty: 'Easy', link: '/program/articles/two-pointers' },
        { id: 'sliding-window', title: '[ Algorithm ] Sliding Window | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/sliding-Window' },
        { id: 'linked-list-two-pointer', title: '[ Algorithm ] Two Pointers - Linked List | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/linked-list-two-pointer' }
      ]
    },
    {
      id: 'searching-sorting',
      title: 'Searching & Sorting',
      color: 'bg-green-500',
      description: 'Search and sort algorithms',
      items: [
        { id: 'binary-search', title: '[ Algorithm ] Binary Search | 核心概念與 Leetcode 題型解析', difficulty: 'Easy', link: '/program/articles/binary-search' },
        { id: 'quick-select', title: '[ Algorithm ] Quick Select | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/quick-select' }
      ]
    },
    {
      id: 'dynamic-programming',
      title: 'Dynamic Programming',
      color: 'bg-purple-500',
      description: 'DP patterns and optimization problems',
      items: [
        { id: 'dp', title: '[ Algorithm ] Dynamic Programming (一) - Introduction | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/dp' },
        { id: 'dp-memo', title: '[ Algorithm ] Dynamic Programming (二) - Memorization | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/dp-memo' },
        { id: 'linear-dp', title: '[ Algorithm ] Dynamic Programming (三) - Linear DP | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/linear-dp' },
        { id: 'knapsack-problem', title: '[ Algorithm ] Dynamic Programming (四) - Knapsack Problem | 核心概念與 Leetcode 題型解析', difficulty: 'Hard', link: '/program/articles/knapsack-problem' },
        { id: 'interval-dp', title: '[ Algorithm ] Dynamic Programming (五) - Interval DP | 核心概念與 Leetcode 題型解析', difficulty: 'Hard', link: '/program/articles/interval-dp' },
        { id: 'digit-dp', title: '[ Algorithm ] Dynamic Programming (六) - Digit DP | 核心概念與 Leetcode 題型解析', difficulty: 'Hard', link: '/program/articles/digit-dp' },
        { id: 'counting-dp', title: '[ Algorithm ] Dynamic Programming (七) - Counting DP | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/counting-dp' },
      ]
    },
    {
      id: 'trees',
      title: 'Trees & Binary Search Trees',
      color: 'bg-orange-500',
      description: 'Tree data structures and operations',
      items: [
        { id: 'binary-tree-traversal', title: '[ Data Structure ] Binary Tree - Traversal | 核心概念與 Leetcode 題型解析', difficulty: 'Easy', link: '/program/articles/binary-tree-traversal' },
        { id: 'binary-search-tree', title: '[ Data Structure ] Binary Search Tree | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/binary-search-tree' },
        { id: 'binary-tree-reconstruction', title: '[ Data Structure ] Binary Tree - Reconstruction | 核心概念與 Leetcode 題型解析', difficulty: 'Hard', link: '/program/articles/binary-tree-reconstruction' }
      ]
    },
    {
      id: 'graphs',
      title: 'Graph Algorithms',
      color: 'bg-red-500',
      description: 'Graph traversal and shortest path algorithms',
      items: [
        { id: 'dfs-bfs', title: '[ Algorithm ] DFS & BFS | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/DFS-BFS' },
        { id: 'topological-sort', title: '[ Algorithm ] Topological Sort | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/topological-sort' },
        { id: 'union-find', title: '[ Algorithm ] Union Find | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/union-find' },
        { id: 'dijkstra', title: '[ Algorithm ] Shortest Path - Dijkstra | 核心概念與 Leetcode 題型解析', difficulty: 'Hard', link: '/program/articles/dijkstra' },
        { id: 'bellman-ford', title: '[ Algorithm ] Shortest Path - Bellman-Ford | 核心概念與 Leetcode 題型解析', difficulty: 'Hard', link: '/program/articles/bellman-ford' }
      ]
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      color: 'bg-pink-500',
      description: 'Essential data structures and operations',
      items: [
        { id: 'hash-tables', title: '[ Data Structure ] Hash Table | 核心概念與 Leetcode 題型解析', difficulty: 'Easy', link: '/program/articles/hash-table' },
        { id: 'stack', title: '[ Data Structure ] Stack & Monotonic Stack | 核心概念與 Leetcode 題型解析', difficulty: 'Easy', link: '/program/articles/stack' },
        { id: 'queue', title: '[ Data Structure ] Queue & Priority Queue | 核心概念與 Leetcode 題型解析', difficulty: 'Easy', link: '/program/articles/queue' }
      ]
    },
    {
      id: 'advanced-algorithms',
      title: 'Advanced Algorithms',
      color: 'bg-indigo-500',
      description: 'Complex algorithmic patterns',
      items: [
        { id: 'backtracking', title: '[ Algorithm ] Backtracking | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/backtracking' },
        { id: 'greedy', title: '[ Algorithm ] Greedy | 核心概念與 Leetcode 題型解析', difficulty: 'Medium', link: '/program/articles/Greedy' },
        { id: 'manacher', title: '[ Algorithm ] Manachers Algorithm | 核心概念與 Leetcode 題型解析', difficulty: 'Hard', link: '/program/articles/manacher' },
        { id: 'kmp', title: '[ Algorithm ] KMP Algorithm | 核心概念與 Leetcode 題型解析', difficulty: 'Hard', link: '/program/articles/kmp' }
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleCompletion = (itemId) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const handleArticleClick = (item) => {
    // In real app, use Next.js router: router.push(item.link)
    window.location.href = item.link;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSectionProgress = (section) => {
    const completed = section.items.filter(item => completedItems.has(item.id)).length;
    return { completed, total: section.items.length, percentage: Math.round((completed / section.items.length) * 100) };
  };

  return (
    <div className="pt-25 max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Leetcode Algorithm Roadmap</h1>
        <p className="text-lg text-gray-600">Master algorithms step by step</p>
      </div>

      {/* Topic Sections */}
      <div className="space-y-4">
        {roadmapData.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const progress = getSectionProgress(section);
          
          return (
            <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Section Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${section.color}`}></div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {/* {progress.completed}/{progress.total} */}
                        total: {progress.total}
                      </div>
                      {/* <div className="text-xs text-gray-500">{progress.percentage}% complete</div> */}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Progress Bar */}
                {/* <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${section.color}`}
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                </div> */}
              </div>

              {/* Section Items */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  <div className="p-4 space-y-2">
                    {section.items.map((item) => {
                      const isCompleted = completedItems.has(item.id);
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleArticleClick(item)}
                          className={`flex cursor-pointer items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                            isCompleted 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="cursor-pointer flex items-center space-x-3">
                            {/* <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCompletion(item.id);
                              }}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                isCompleted
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300 hover:border-green-500'
                              }`}
                            >
                              {isCompleted && <Check className="w-3 h-3 text-white" />}
                            </button> */}
                            
                            <div>
                              <h4 className="font-medium text-gray-900">{item.title}</h4>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                              {item.difficulty}
                            </span>
                            
                            <button
                              onClick={() => handleArticleClick(item)}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <BookOpen className="w-4 h-4" />
                              <span className="text-sm">Read</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Progress */}
      {/* <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {roadmapData.map((section) => {
            const progress = getSectionProgress(section);
            return (
              <div key={section.id} className="text-center">
                <div className={`w-3 h-3 rounded-full ${section.color} mx-auto mb-2`}></div>
                <div className="text-sm font-medium text-gray-900">{section.title}</div>
                <div className="text-xs text-gray-500">{progress.completed}/{progress.total}</div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round((completedItems.size / roadmapData.reduce((acc, section) => acc + section.items.length, 0)) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Total Completion</div>
        </div>
      </div> */}

    </div>
  );
};

export default TopicRoadmap;