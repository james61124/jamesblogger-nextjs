---
title: "Amazon"
date: 2024-02-20
draft: false
author: "James"
tags:
  - LINE FRESH
image: /images/LINE-FRESH.jpg
description: ""
toc: 
categories:
  - 生活
---

首先很幸運可以在找 summer intern 的幾乎最後關頭收到 Amazon offer，前前後後改了不知道幾版履歷，找了多少內推，還去行天宮拜拜，把去日本買的御守拿出來供俸，我是一個不太相信玄學的人，可見我是真的已經沒招了，所以是真的滿感謝的。

分享一下收到 offer 前大概經歷過哪些，首先 OA 是兩題 coding 題，這應該大部分人都解得出來我記得沒有很難，真正麻煩的是後面的 BQ。他們的 OA 是真的會用 BQ 刷人的，

我到現在還是不太曉得為什麼我被分配到 Arlington, VA，這真的很酷，當你看到你申請幾乎所有朋友都跑到加州去，就我一個人跑到東岸的一個我也沒聽過的地方，我還是覺得很神奇。但生活就是這樣，每到一個新地方，就會有新發現，也會遇到新的人發展出新的故事。

我公司就在五角大廈附近，真的是附近，大概一站地鐵站，所以治安好的不得了，我半夜在路上走也不太會覺得危險。然後過個河就是 DC，再往前一點就到 Maryland，所以我常常看到有人說 DMV 地區，就是指 DC/Maryland/Virginia 這塊交界處，在這邊生活基本上一次就解鎖三個州了。

Amazon 辦公室是滿舒服的，但福利就是沒有很好，每天只有一杯免費咖啡跟免費香蕉，其他東西都要錢，零食要付錢，水果要付錢，早餐午餐也要付錢，不曉得為什麼。然後 policy 是說不能 remote，所以我們 team 有一個固定的區域可以辦公，我基本上都坐在同一個位子工作。

在大公司裡面寫 code 跟平常在寫 code 真的不太一樣，首先我覺得整個開發流程很嚴謹，雖然會有點麻煩但是 contribute 起來會讓人很放心。每一個 repo 都有很完整的 pipeline，所以每個 pr merge 進去之後會經過 beta / gamma 最後沒問題才會走到 prod，每個 pr 都需要經過一兩個人 review 才能 merge 進去，所以基本上不太會有把 prod 搞砸的機會。但這其實也是麻煩的地方，

pr 的管理也是門學問，我是盡可能把我的 project 扁平化，確保 pr 待審的時候我還有事情做。因為如果同時送兩三個有 dependency 的 pr，前面的 pr 改了後面可能就需要重改，我覺得這樣反而沒有比較快。

再來也是我覺得很不可思議的部分，Amazon 的 AI 化程度比我想像中高，我不曉得是不是所有公司都變成這樣，撇除掉 SWE 會不會因此 position 變少的問題，現在開發起來是真的挺方便的。他們用的 AI Agent - Kiro 我後來查好像不是 internal 的，我之前是沒聽過，但他可以接很多內部工具，簡單來說我今天要從頭理解我們 team 的整個系統在幹嘛，他有海量的 microservices 海量的 APIs，在研究 project 要怎麼做的時候沒有人跟我說有哪些工具可以用，在沒有 AI 的情況我可能得想辦法從一大堆 repo 裡面翻有沒有能用的東西，然後一直來回問同事，但是有 AI Agent 基本上他能查 internal website 能查所有 repo 還能快速讀 code，做這種事情真的超級快。

再來也是我覺得很酷但也很麻煩的地方，pr 送出去之後會經過一系列檢查，其中有一項是 AutoSDE，簡單講就是 AI Agent 來幫忙做 code review，其實他給的建議都挺不錯的，有些地方有問題真的都找得出來，但他的問題就是因為他是 generative AI，這次改完他的所有 comments 下次又會出現新的，

所以現在的 SWE 我覺得最麻煩的地方已經不是寫 code 了，好吧可能還是看寫什麼，但至少我在這邊做的東西 coding 部分其實是很快的，麻煩的地方在一些權限問題。像是 service 跟 service 之間的溝通很麻煩，如果不是有 public API 可以直接用，有一些要 STS Assume Role 假裝成另一個 service 才可以用，但得先確保這個 service 有同意讓另一個 service Assume Role 才行，或是有一些其他組的 API 我們想用，得先開 tickets 請他們幫我們開權限，然後這個 tickets 轉來轉去可能就又過一兩個禮拜了，我還有遇過有個 service 因為設定 private only，所以只有通過 corp network 才有 interface 戳到他，但問題是 service 跟 service 間走的不是 corp network，然後研究了一兩個禮拜都繞不過去，處理這些東西比起寫 code 本身要麻煩多了。

再來 Amazon 有一個我一直搞不太清楚的文化，我覺得我們組的所有人都很忙，我在之前的公司還有其他人的公司聽到的都是「多問問題」，但我在這感受到的好像不是這樣，我接收到的 instruction 是建議我一天不要打斷我的 mentor 工作太多次，因為他超級無敵忙事情超多，然後他已經有排 1 on 1 給我了，所以我應該盡可能 aggregate 問題一起問他比較好，雖然我的 mentor 人很好好像沒有太 care 這塊，我是沒有覺得這是一個陋習，但就是覺得還滿酷的，每間公司的文化都不太一樣。

