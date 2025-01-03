/*
content.js 的主要功能是监听用户点击事件和收藏操作，获取相关信息并传递给后台。
*/

(function () {
    // 判断是否在首页
    const isHomepage = window.location.href === 'https://www.xiaohongshu.com/explore'; //|| window.location.pathname.startsWith('/explore');
  
    if (isHomepage) {
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
          alert('用户点击了帖子:', postTitle, postLink);
		
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
              link: postLink,
            }
          });
        }
      });
    }
  
    // 判断是否在帖子详情页
    const isPostDetailPage = window.location.href != 'https://www.xiaohongshu.com/explore' && window.location.pathname.startsWith('/explore/'); //|| window.location.pathname.startsWith('/post/');
    if (isPostDetailPage) {
      console.log('小红书详情页脚本已加载');
      //alert('小红书详情页脚本已加载');
			
      const saveButton = document.querySelector('.collect-wrapper');
      //saveButton.addEventListener('click', () => {  //先监听收藏按钮click事件，再监测dom变化
      document.addEventListener('click', (event) => {
        
      //alert(event.type + " at " + event.currentTarget);

      let clickElement = event.target.closest('.collect-wrapper'); // 假设帖子卡片有类名 `post-card`
      if (clickElement) {  //如果点击的是收藏按钮

      // 监测dom变化  
      //const observer = new MutationObserver(() => {
        //const saveButton = document.querySelector('.collect-wrapper'); // 假设收藏按钮有类名 `save-button`
        //if (saveButton) {
          //lert("检测到收藏列表")
          //saveButton.addEventListener('click', () => {
            let t = setInterval(() => {
              const saveDialog = document.querySelector('.board-list'); // 假设收藏弹窗有类名 `save-dialog`
              const collections = Array.from(
                saveDialog.querySelectorAll('.board-item')
              ).map((item) => item.innerText);
  
              console.log('用户收藏了帖子，收藏夹:', collections);
              //alert('用户收藏了帖子，收藏夹:', collections);
  
              // 将收藏信息发送到后台
              chrome.runtime.sendMessage({
                type: 'post_save',
                data: {
                  url: window.location.href,
                  collections: collections,
                }
              });

              clearInterval(t);
            }, 1000); // 延迟以确保收藏夹弹窗内容加载完成
          //});
  
          // 停止观察，避免重复绑定事件
          //observer.disconnect();
        //}
      //});

      //observer.observe(document.body, { childList: true, subtree: true });
      
      }

      }); //addEventListener('click')
    }
  })();