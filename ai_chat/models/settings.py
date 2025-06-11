from odoo import models, fields, api


class AiChatSettings(models.Model):
    _name = "ai.chat.settings"
    _description = "AI Chat Settings"

    # OpenAI API 密钥
    api_key = fields.Char(string="API 密钥")
    # OpenAI API 组织 ID
    ai_organization_id = fields.Char(string="OpenAI 组织 ID")
    # OpenAI 模型
    ai_model = fields.Selection(
        [
            ("deepseek-chat", "deepseek-chat"),
            ("deepseek-reasoner", "deepseek-reasoner"),
        ],
        string="使用模型",
        default="deepseek-chat",
    )
