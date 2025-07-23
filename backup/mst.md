684
prim

```cpp
int prim(const vector<vector<pair<int, int>>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, 0}); // {cost, node}
    int totalCost = 0;

    while (!pq.empty()) {
        auto [cost, u] = pq.top(); pq.pop();
        if (visited[u]) continue;
        visited[u] = true;
        totalCost += cost;

        for (auto& [v, w] : adj[u]) {
            if (!visited[v]) {
                pq.push({w, v});
            }
        }
    }

    return totalCost;
}
```