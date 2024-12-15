// 从本地存储中读取记录
chrome.storage.local.get(['records'], (result) => {
    const records = result.records || [];
    const recordsContainer = document.getElementById('records');
    records.forEach((record) => {
      const recordDiv = document.createElement('div');
      recordDiv.className = 'record';
      recordDiv.textContent = `${record.timestamp} - ${record.method} - ${record.url}`;
      recordsContainer.appendChild(recordDiv);
    });
});