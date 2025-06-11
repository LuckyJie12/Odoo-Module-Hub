from odoo import http
from odoo.http import request, route
from openai import OpenAI
import random


class ChatController(http.Controller):
    @http.route(["/aichat/generate"], type="json", auth="user")
    def generate_response(self, **kwargs):
        """
        调用Deepseek API
        """
        # 查找第一个API密钥
        settings = (
            request.env["ai.chat.settings"]
            .sudo()
            .search([], order="create_date asc", limit=1)  # 按创建时间升序
        )
        api_key = settings.api_key
        if not api_key:
            return {"error": "请先设置API密钥"}
        # 获取模型
        ai_model = settings.ai_model
        if not ai_model:
            return {"error": "请先设置使用模型"}
        content = kwargs.get("params", "")
        messages = [
            {"role": "system", "content": "你是一个有帮助的助手"},
            {"role": "user", "content": content},
        ]
        # API调用
        try:
            client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
            response = client.chat.completions.create(
                model=ai_model,
                messages=messages,
                max_tokens=1024,
                temperature=0.7,
                stream=False,
            )
            return {
                "content": response.choices[0].message.content
            }
        except Exception as e:
            return {"error": f"API调用失败: {str(e)}"}
