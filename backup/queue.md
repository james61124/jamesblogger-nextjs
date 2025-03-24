

push(value)	將元素插入到優先隊列中，時間複雜度 O(log n)
pop()	移除隊首元素（最大/最小值），O(log n)
top()	取得隊首元素（不移除），O(1)
empty()	檢查隊列是否為空，O(1)
size()	返回隊列中元素的數量，O(1)

priority_queue<int> pq; // 大的會先出
priority_queue<int, vector<int>, greater<int>> minHeap; // 小的會先出

struct Compare {
    bool operator()(int a, int b) {
        return a > b; // 讓 priority_queue 變成最小堆
    }
};

priority_queue<int, vector<int>, Compare> pq;

compare 如果是 true，a 優先級比較低

239
347