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
              id: postLink,
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
                  id:window.location.origin+window.location.pathname,
                  url: window.location.href,
                  collection: savedCollection,  //收藏到指定收藏夹
                }
              });

              clearInterval(t);
            }, 1000); // 延迟以确保收藏夹弹窗内容加载完成

      
      }

      }); //addEventListener('click')
    }
  })();