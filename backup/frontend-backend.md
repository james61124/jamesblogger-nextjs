

### **什麼是前端與後端？**

簡單來說，前端就是「使用者可以看到的部分」，舉例來說，如果今天有一個登入頁面，所有看得到的輸入框、按鈕、背景圖、標題等等全部都是前端的範疇。而後端則是「系統的後台」，也就是使用者看不到的部分，例如說我們在登入頁面輸入完帳號密碼按下「登入」，網站就會把剛剛輸入的東西送到「後端」處理，他可以判斷你的帳號密碼有沒有輸錯，如果是註冊的資料他可以把資料送到資料庫等等，這些背後的運算都是後端的範疇。

前端處理與用戶的互動，後端處理業務邏輯，網站大致就是由這兩大塊組合而成的。

### **淺談前端 ( Front-end )**

前端的核心技術就是大名鼎鼎的 HTML / CSS / Javascript，每種技術都有各自的用途

#### HTML ( HyperText Markup Language )

HTML 負責網站的基本結構與內容定義，像是網站的骨架，負責確定網站的元素，例如說哪裡要放一個按鈕、哪裡要寫上標題、哪裡要放上一張圖片，這些都是 HTML 的工作範圍。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
</head>
<body>
  <h1>Welcome to My Website</h1>
  <button id="myButton">Click Me</button>
  <p>This is a paragraph of text on my page.</p>
</body>
</html>
```

這個範例中，標題 `<h1>`、按鈕 `<button>`、段落 `<p>`，這些都是拿來定義網站架構的標籤。

#### CSS ( Cascading Style Sheets )

CSS 負責網站的美化與佈局，例如按鈕要多長多寬、顏色要是什麼、字體大小字型等等。

```css
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 0;
  }

  h1 {
    color: #333;
    text-align: center;
  }

  #myButton {
    background-color: #007BFF;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
  }
</style>
```

這裡就定義了標題的顏色位置、按鈕的樣式等等。

#### Javascript ( JS )

而 JavaScript 的目的就是要讓網站「動起來」，它讓網站擁有互動性。JS 可以來處理用戶的操作，比如按鈕點擊、表單提交或頁面跳轉等等，同時也是前後端一個溝通的橋樑，可以讓前端跟後端的數據做資料交換。

```Javascript
<script>
  document.getElementById('myButton').addEventListener('click', function() {
    alert('Button Clicked!');
  });
</script>
```

這裡就定義了一個簡單的 function，當用戶點擊按鈕的時候，會跳出一個小提示框。

### **前端框架與技術**

但是我們如果只用 HTML / CSS / JS 來開發網站，會遇到下面幾個問題：

1. 缺乏結構化：每個人寫的 JS 都不一樣，沒有統一的組織方式，全域變數滿天飛，如果需要多人協作會很難維護。
2. UI 難以重複使用：如果今天有一塊 UI 需要重複使用，例如每一頁頁碼都要長一樣，或是按鈕型態都要一樣，就要一直複製貼上，如果要修改還得一個一個改，很容易出錯。
3. 資料與畫面同步很難處理：如果資料改變，傳統的方式需要手動操作 DOM 去更新畫面，邏輯很容易出錯。這裡簡單講一下 DOM ( Document Object Model )，DOM 可以想像成瀏覽器建立出來的一個 tree structure，HTML 的每一個標籤 (<div>, <h1> 等等)，都會被瀏覽器解析成一個節點 (node)，這些 node 會組成一顆 tree，所以如果我們要進行畫面更新，我們需要操作 JS 來新增、刪除或是更新這些 node，邏輯容易亂、效能很差而且也很難維護。
4. 缺乏生命週期概念與模組化開發支援：無法像後端一樣清楚知道 element 何時建立、更新或消失，所以可能會有很多 memory leak 或是邏輯錯誤的問題。