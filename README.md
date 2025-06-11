# Odoo Module Hub 

# [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)  

> **Odoo 模块集合**：高效整合第三方模块与原创模块仓库

---

### 1. **ai_chat** - AI智能对话助手  

> **✨ 核心功能**  
>
> - **当前集成了 `Deepseek` 对话接口**

> **⚙️ 安装指南**  
>
> ```bash
> # 安装前需安装Python依赖
> pip install openai
> ```

> **🔧 待优化功能**  
>
> | 功能项     | 状态     | 优先级 |
> | ---------- | -------- | ------ |
> | 上下文联动 | 开发中   | ⭐️⭐️⭐️⭐️   |
> | 多模型切换 | 规划中   | ⭐️⭐️⭐️    |
> | 附件解析   | 需求分析 | ⭐️⭐️     |
> | 知识库检索 | 概念设计 | ⭐️      |

---

### 2. **multi_tab** - 多标签工作区  

> **🚀 核心功能**  
>
> - **浏览器式导航**：同时打开多个视图（表单/列表/报表）
> - **会话隔离**：独立保存各标签页的表单状态与筛选条件

> **🐞 已知问题**  
>
> - 部分视图兼容性问题（看板视图标签切换异常）
> - 取消多标签后布局异常

> **🙏 鸣谢参考**  
> [笑看人生/odoo_shili](https://gitee.com/huangweixiao/odoo_shili)

---

## 📜 License

本仓库整体遵循 [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0) 协议。

> ⚠️ **注意：** 各模块可使用不同的开源许可证，具体请查阅各模块的 `__manifest__.py` 文件中的 `license` 字段。

---

## 🔗 关于 OCA

OCA（[Odoo Community Association](http://odoo-community.org/)）是一个非营利组织，旨在推动 Odoo 的协作式开发与广泛应用，支持模块开发者与开源社区生态建设。
