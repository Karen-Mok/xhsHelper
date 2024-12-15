/*
该代码会拦截小红书页面的 XMLHttpRequest 和 Fetch 请求，
检查是否包含 /api/sns/v1/like（点赞）或 /api/sns/v1/collect（收藏）的 URL。
如果匹配到这些 API，就将相关信息发送给插件后台
*/

(function () {
    // Hook XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      if (url.includes('/api/sns/v1/like') || url.includes('/api/v2/collect')) {
        console.log('Intercepted request:', method, url);
  
        // 记录到插件后台
        chrome.runtime.sendMessage({
          type: 'record_action',
          method: method,
          url: url
        });
      }
      return originalOpen.call(this, method, url, ...rest);
    };
  
    // Hook Fetch API
    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
      const url = typeof input === 'string' ? input : input.url;
      if (url.includes('/api/sns/v1/like') || url.includes('/api/v2/collect')) {
        console.log('Intercepted fetch request:', url);
  
        // 记录到插件后台
        chrome.runtime.sendMessage({
          type: 'record_action',
          method: init?.method || 'GET',
          url: url,
          body: init?.body || null
        });
      }
      return originalFetch(input, init);
    };
  })();