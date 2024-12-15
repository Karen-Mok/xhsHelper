/*
background.js 用于接收 content.js 发送的数据，并将这些数据存储到插件本地存储或发送到自己的服务器。
*/

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'record_action') {
      console.log('Received action:', message);
  
      // 将记录保存到插件的本地存储
      chrome.storage.local.get(['records'], (result) => {
        const records = result.records || [];
        records.push({
          method: message.method,
          url: message.url,
          body: message.body,
          timestamp: new Date().toISOString()
        });
  
        chrome.storage.local.set({ records }, () => {
          console.log('Record saved locally:', records);
        });
      });
  
      // 可选：将数据发送到自己的服务器
      fetch('https://your-backend-server.com/api/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          method: message.method,
          url: message.url,
          body: message.body,
          timestamp: new Date().toISOString()
        })
      }).then((response) => {
        console.log('Data sent to backend:', response);
      }).catch((error) => {
        console.error('Failed to send data to backend:', error);
      });
    }
  
    sendResponse({ success: true });
  });