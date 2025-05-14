import Mock from 'mockjs';

// 设置延迟时间
Mock.setup({
  timeout: '200-600'
});

// 生成随机用户数据
const userData = Mock.mock({
  'records|30': [{
    'id|+1': 1,
    'name': '@cname',
    'age|18-60': 1,
    'status|1': ['active', 'inactive'],
    'address': '@county(true)',
    'email': '@email',
    'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")'
  }],
  'total': 30
});

// 模拟用户列表接口
Mock.mock(/\/api\/users(\?.+)?$/, 'get', (options: any) => {
  // 解析请求参数
  const url = options.url;
  const pageSize = parseInt(url.match(/pageSize=(\d+)/)?.[1] || '10');
  const pageNum = parseInt(url.match(/pageNum=(\d+)/)?.[1] || '1');
  const keyword = url.match(/keyword=([^&]*)/)?.[1] || '';
  
  // 过滤数据
  let records = userData.records;
  if (keyword) {
    records = records.filter((item:any)=> 
      item.name.includes(keyword) || 
      item.address.includes(keyword)
    );
  }
  
  // 分页处理
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageRecords = records.slice(startIndex, endIndex);
  
  return {
    code: 200,
    message: '操作成功',
    data: {
      records: pageRecords,
      total: records.length
    }
  };
});
// 菜单相关
import './menu'

export default Mock;