---
title: "[ System Design ] CAP 理論完整解釋：分散式系統的設計抉擇與實務應用"
date: "2025-04-15"
author: James
tags: System Design,CAP Theorem
image: /images/program/system-design.png
description: "設計 Distributed System 時不可能同時滿足 Consistency ( 一致性 ), Availability ( 可用性 ), Partition Tolerance ( 分區容錯性 ) 三角，我們一次只能保證 Consistency 或是 Availability 兩件事的其中一件，也就是我們需要 trade-off"
readTime: 5
---

當我們在使用資料庫時，會發現單一機器是有極限的，當應用變多，使用者變多時，可能會遇到以下四種限制

1. 效能限制 ( Performance Bottleneck ) - 一台 server 的 CPU、記憶體、IO 都是有限的，單台機器可能會無法承受大量的資料
2. 容量限制 ( Storage Limit ) - 單台機器硬碟再大，一定會有上限，像是我們不可能把整個 Meta 的資料都存到「單台機器」裡
3. 可用性低 ( Single Point Failure ) - 假設這台機器出問題，那整個服務就都沒有辦法用了
4. 擴展性差 ( Scaling Limits ) - 如果要做垂直擴展，就是加大單台機器的容量，成本高而且也不彈性，所以最好的辦法就是要做水平擴展

這也是為什麼我們需要分散式系統 - Distributed System，而 CAP Theorem 就是用在這裡，用一句話概括 CAP Theorem:

> 設計 Distributed System 時不可能同時滿足 Consistency ( 一致性 ), Availability ( 可用性 ), Partition Tolerance ( 分區容錯性 ) 三角，我們一次只能保證 Consistency 或是 Availability 兩件事的其中一件，也就是我們需要 trade-off

### **CAP 三個核心概念定義**

首先先介紹一下 CAP 中三個最重要的名詞解釋：Consistency, Availability 以及 Partition Tolerance

#### **Consistency 一致性**

如果一個 Distributed System 符合 Consistency，表示

> 每一次讀取資料的時候都會讀到最新的資料

聽起來很像廢話，但其實沒有這麼簡單，想像一下我們在 node A 寫入一筆資料，他要更新到其他 node 一定要一段時間，這時候如果我在 node B 馬上讀取，那我有可能會讀不到這筆最新的資料，而所有符合 Consistency 的 system 都要避免這種事情發生，所以如果有其中一台機器還來不及同步，那系統就會拒絕回應來維持 Consistency。

不過需要注意的是 Consistency 不一定代表「資料正確」，只是代表所有機器上的資料版本都一樣而已。

#### **Availability 可用性**

如果一個 Distributed System 符合 Availability，表示

> 每個 requests 都會獲得 response，不會 timeout 或是掛掉

對 Availability 來說，「有回應」比「回應正確」還要來得重要，所以即使這個 node 的資料還沒有完全同步，只要收到 request 他還是會給 response，即使給的是舊資料，也就是說他的讀寫操作都會盡量不失敗或是等太久。

#### **Partition Tolerance**

如果一個 Distributed System 符合 Partition Tolerance，表示

> 系統中如果有某些 node 網路斷了無法彼此通訊，系統還是要能正常運作處理 requests

所以其實 Partition Tolerance 不是一個「選項」，而是一個 Distributed System 設計的前提，因為「部分 node 通訊斷掉」是所有 Distributed System 一定會遇到的情況，所以所有的 Distributed System 都一定要符合 Partition Tolerance。

### **CAP Theorem 本身**

CAP Theorem 説三種特質裡面我們一定只能滿足其中兩種，所以就要做 trade off，但是因為 Partition Tolerance 是所有 Distributed System 都一定要滿足的，所以實際上我們只有兩個選擇 : CP 系統 vs. AP 系統

CP 系統顧名思義就是犧牲 Availability 選擇 Consistency，所以在一個 node 還沒有辦法確定是不是最新版本的時候，他會選擇暫停服務，他寧願不回資料也不會回錯誤的資料，所以 CP 系統回應慢，但是資料是正確的，金融系統就很適合這套理論，因為總不可能我提領了錢，但是系統來不及更新到我扣錢，然後我就可以無限提領錢吧？

而 AP 系統剛好相反，犧牲 Consistency 選擇 Availability，所以他在高併發的時候還是可以很好的回應請求，因為他可以接受先寫入一個 node，晚一點再把所有 node 同步，例如說社群平台就滿適合這個理論的，因為我可以先 create 一則貼文，但他晚一點再顯示也沒有關係。

> 但其實現實世界中，很少純粹只選 AP 或是 CP

AP 跟 CP 只是一個觀念，但是大部分情況是沒有辦法非黑即白的分辨什麼資料庫是 AP 什麼是 CP，大型系統的設計上是可以透過協議跟架構模糊這個選擇的，可能某些資料需要比較好的 Consistency，某些資料比較需要 Availability，都是可以自由設計的。

### **SQL != CP, noSQL != AP**

那有些人可能就會有疑問，這麼說來

> SQL 強調 Consistency，noSQL 強調 Availability，所以 SQL 就是 CP，noSQL 就是 AP 囉？

這其實不完全是這樣，應該說「SQL 傾向 CP 設計，但不等於就是 CP，部分 noSQL 傾向 AP 設計，但也不等於就是 AP」。

首先，傳統 SQL 系統多數不具備「P」的特性，所以不完全適用 CAP，但如果他真的實作成分散式系統時，只能說他傾向實現 CP，而 SQL 強調的 ACID 中的 C 指的是交易執行前後都滿足定義好的規則，所以重點是交易的開始跟結束都要是合法的狀態，而 CP 中的 C 指的是所有 node 針對同一筆資料都會觀察到相同的值，本質上是不同概念。

而 noSQL 只是一個統稱，實際上他有非常多分類，像是 Key-Value, Document, Graph 等等，每一種的特性跟傾向都不太一樣，這邊就不細細討論這個，但只能說：

> SQL 資料庫通常強調一致性與交易安全性，因此在分散式環境下傾向 CP 設計；而部分 NoSQL 系統為了提高 Availability 與 Scailability，在分散式環境下偏好 AP 設計。

