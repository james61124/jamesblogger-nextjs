

### **Interval DP**

```cpp
dp[i][j] = max(dp[i+1][j-1], dp[i+1][j], dp[i][j-1]) + cost[i][j]
```

516

```cpp
dp[i][j] = max/min(dp[i][k] + dp[k+1][j] + cost[i][j])
```

1547