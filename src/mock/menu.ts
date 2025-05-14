import Mock from "mockjs"
import routeList from '../router/staticData'

// 获取菜单列表
Mock.mock(/\/api\/menu\/list/, "get", () => {
  return {
    code: 0,
    data: routeList,
    msg: "获取成功",
  }
})