/*
background.js 用于接收来自 content.js 的信息，并将其存储到插件的本地存储，或者用于后续处理。
*/

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'post_click') {
      console.log('记录用户点击的帖子:', message.data);
  
      // 保存点击的帖子信息到本地存储。路径：插件右键-审查弹出内容-应用-存储-扩展程序存储-本地
      chrome.storage.local.get(['clickedPosts'], (result) => {
        const clickedPosts = result.clickedPosts || [];
        clickedPosts.push({
          title: message.data.title,
          link: message.data.link,
          timestamp: new Date().toISOString(),
        });
  
        chrome.storage.local.set({ clickedPosts }, () => {
          console.log('帖子点击信息已保存:', clickedPosts);
        });
      });
    } else if (message.type === 'post_save') {
      console.log('记录用户收藏的帖子:', message.data);
  
      // 保存收藏信息到本地存储
      chrome.storage.local.get(['savedPosts'], (result) => {
        const savedPosts = result.savedPosts || [];
        savedPosts.push({
          url: message.data.url,
          collections: message.data.collections,
          timestamp: new Date().toISOString(),
        });
  
        chrome.storage.local.set({ savedPosts }, () => {
          console.log('帖子收藏信息已保存:', savedPosts);
        });
      });
    }
  
    sendResponse({ success: true });
  });