(function () {
  console.log('小红书插件已加载');

  // 当前页面路径
  let previousPath = window.location.pathname;

  // 判断页面类型（首页或详情页）
  function handlePageChange() {
    const currentPath = window.location.pathname;

    if (currentPath === previousPath) {
      //alert("pathname无变化")
      return; // 如果路径没有变化，则不需要处理
    }

    //alert('页面路径发生变化:', previousPath, '=>', currentPath);

    // 更新路径
    previousPath = currentPath;

    // 判断是否在首页
    if (currentPath === '/explore') {
      //alert('切换到首页逻辑');
      handleHomepageLogic();
    }
    // 判断是否在帖子详情页
    else if (currentPath != '/explore' && currentPath.startsWith('/explore/')) {
      //alert('切换到帖子详情页逻辑');
      handlePostDetailLogic();
    }
  }

  // 首页逻辑
  function handleHomepageLogic() {
    console.log('小红书首页脚本已加载');
    //alert('小红书首页脚本已加载');

    // 监听首页帖子点击事件
    document.addEventListener('click', (event) => {
      //alert('用户点击了帖子');
      let postElement = event.target.closest('.note-item'); // 假设帖子卡片有类名 `post-card`
      if (postElement) {
        const postTitle = postElement.querySelector('.title')?.textContent || '未知标题';

        const postLink = postElement.querySelector('a')?.href || '未知链接';  //？.可选链运算符
        console.log('用户点击了帖子:', postTitle, postLink);
        //alert('用户点击了帖子:', postTitle, postLink);

        /*不需要这段代码了
        chrome.storage.local.set({
          "帖子标题:":postTitle,
          "帖子链接:":postLink
        });
        */

        // 将帖子信息发送到后台
        chrome.runtime.sendMessage({
          type: 'post_click',
          data: {
            title: postTitle,
            id: postLink,
            link: postLink,
          }
        });
      }
    });
  }

  // 帖子详情页逻辑
  function handlePostDetailLogic() {
    console.log('小红书详情页脚本已加载');
    //alert('小红书详情页脚本已加载');

    const saveButton = document.querySelector('.collect-wrapper');
    //saveButton.addEventListener('click', () => {  //先监听收藏按钮click事件，再监测dom变化
    document.addEventListener('click', (event) => {

      //alert(event.type + " at " + event.currentTarget);

      //let clickElement = event.target.closest('.collect-wrapper');
      let clickElement = event.target.closest('.board-item');
      if (clickElement) {  //如果点击的是收藏列表中的一个

        let t = setInterval(() => {
          const savedCollection = clickElement.querySelector('.name-text').textContent; // 假设收藏弹窗有类名 `save-dialog`

          /*获取所有收藏夹，可用，但没必要
          const collections = Array.from(
            saveDialog.querySelectorAll('.board-item')
          ).map((item) => item.innerText);*/


          // 将收藏信息发送到后台
          chrome.runtime.sendMessage({
            type: 'post_save',
            data: {
              title: document.querySelector("#detail-title").textContent,
              id: window.location.origin + window.location.pathname,
              url: window.location.href,
              collection: savedCollection,  //收藏到指定收藏夹
            }
          });

          clearInterval(t);
        }, 1000); // 延迟以确保收藏夹弹窗内容加载完成


      }

    }); //addEventListener('click')
  }

  // 拦截 `history.pushState` 和 `history.replaceState`
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    alert("pushState");
    handlePageChange(); // 检测页面变化
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    alert("replaceState");
    handlePageChange(); // 检测页面变化
  };

  // 监听 `popstate` 事件（浏览器的前进/后退按钮）来源：gpt4，不起作用
  //window.addEventListener('popstate', handlePageChange);

  //navigation.addEventListener('navigate', handlePageChange); 来源：so，不起作用

  /*
  //监听body变化后，对比href变化。来源：so。有效但有bug:首页帖子必须下划一点才能检测到body变化、鼠标点击。
  const observeUrlChange = () => {
    let oldHref = document.location.href;
    const body = document.querySelector('body');
    const observer = new MutationObserver(mutations => {
      if (oldHref !== document.location.href) {
        oldHref = document.location.href;
        handlePageChange();
      }
    });
    observer.observe(body, { childList: true, subtree: true });
  };

  //window.onload = observeUrlChange;
  window.addEventListener("load", observeUrlChange)*/

  const observeUrlChange = () => {
    let oldHref = document.location.href;
    const targetNode = document.querySelector('body'); // Or a more specific element
    if (!targetNode) return; // Handle cases where the target is not yet available
  
    const observerOptions = { childList: true, subtree: true };
  
    const observer = new MutationObserver(mutations => {
      if (oldHref !== document.location.href) {
        oldHref = document.location.href;
        handlePageChange();
      }
    });
  
    observer.observe(targetNode, observerOptions);
  
    // Store the observer for later disconnection if needed:
    window.urlChangeObserver = observer;
  };
  
  window.addEventListener('load', observeUrlChange);
  window.addEventListener('hashchange', handlePageChange);
  window.addEventListener('popstate', handlePageChange);
  

  // 初始化，判断当前页面类型
  //handlePageChange();
})();