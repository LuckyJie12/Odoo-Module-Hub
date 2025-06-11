import { rpc } from "@web/core/network/rpc";
import { registry } from "@web/core/registry";

const generateResponse = {
  // 必须包含的 start 方法（服务初始化入口）
  start(env) {
    return this; // 返回实例或必要对象
  },
  setupPolling() {
    // 初始加载数据
    this.loadData();
  },
  async loadData(parmas) {
    try {
      const data = await rpc("/aichat/generate", {
        params: parmas,
      });
      if (!data) {
        return "数据加载失败";
      } else {
        if (data.error) {
          return "数据加载失败" + data.error;
        }
        return data.content;
      }

    } catch (error) {
      console.error("请求失败:", error);
      return "请求失败" + error;
    }
  },
};
registry.category("services").add("generateresponse", generateResponse);