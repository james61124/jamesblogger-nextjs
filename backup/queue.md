

### **Priority Queue**

priority queue 在 C++ 中是一個 STL，可以直接調用，他跟 queue 不一樣的地方在於他在 push value 的時候會把整個 queue 排列過一次，所以需要耗費 O(log n) 來 push，剩下的部分就跟 queue 差不多了。

#### **宣告**

C++ 的 priority queue 預設是 maxHeap，所以在 pop() 的時候是大的會先出，寫起來是這樣：

```cpp
priority_queue<int> pq;
```

如果想要小的先出的話，要把它轉成 minHeap，可以這樣寫：

```cpp
priority_queue<int, vector<int>, greater<int>> pq;
```

| **函式**      | **描述**                                | **時間複雜度**    |
|---------------|---------------------------------------|-------------------|
| `push(value)` | 將元素插入到優先隊列中                | O(log n)         |
| `pop()`       | 移除隊首元素（最大/最小值）            | O(log n)         |
| `top()`       | 取得隊首元素（不移除）                 | O(1)             |
| `empty()`     | 檢查隊列是否為空                       | O(1)             |
| `size()`      | 返回隊列中元素的數量                   | O(1)             |

`priority_queue<int> pq;` // 大的會先出
`priority_queue<int, vector<int>, greater<int>> minHeap;` // 小的會先出

struct Compare {
    bool operator()(int a, int b) {
        return a > b; // 讓 priority_queue 變成最小堆
    }
};

`priority_queue<int, vector<int>, Compare> pq;`

compare 如果是 true，a 優先級比較低

239
347