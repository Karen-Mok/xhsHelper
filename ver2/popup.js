 // 显示点击的帖子记录
 chrome.storage.local.get(['clickedPosts'], (result) => {
    const clickedPosts = result.clickedPosts || [];
    const clickedList = document.getElementById('clicked-list');
    clickedPosts.forEach((post) => {
      const div = document.createElement('div');
      div.className = 'post';
      div.innerHTML = `<strong>${post.title}</strong><br><a href="${post.link}" target="_blank">${post.link}</a><br>${post.timestamp}`;
      clickedList.appendChild(div);
    });
  });

  // 显示收藏的帖子记录
  chrome.storage.local.get(['savedPosts'], (result) => {
    const savedPosts = result.savedPosts || [];
    const savedList = document.getElementById('saved-list');
    savedPosts.forEach((post) => {
      const div = document.createElement('div');
      div.className = 'post';
      div.innerHTML = `<strong>${post.url}</strong><br>标题: ${post.title}<br>收藏夹: ${post.collection}<br>${post.timestamp}`;
      savedList.appendChild(div);
    });
});