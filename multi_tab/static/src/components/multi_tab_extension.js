import { patch } from "@web/core/utils/patch";
import { user } from "@web/core/user";
import { WebClient } from "@web/webclient/webclient";
import { MultiTabs } from "./multi_tabs";
// 判断是否加载了企业版模块并设置 WebClient 的具体实现
const enterpriseModule = odoo.loader.modules.get("@web_enterprise/webclient/webclient");
const WebClientImplementation = enterpriseModule ? enterpriseModule.WebClientEnterprise : WebClient;
const originalSetup = WebClientImplementation.prototype.setup;
patch(WebClientImplementation, {
  components: {
    ...WebClientImplementation.components,
    MultiTabs,
  },
})
patch(WebClientImplementation.prototype, {
  setup() {
    // 先调用原始 setup 确保基础组件初始化
    originalSetup.call(this);
    // 根据用户上下文决定是否使用多标签容器
    this.shouldUseMulActionContainer = user.context.is_multiple_tags || false;
  }
});
