from odoo import models, fields, api


class ChatMessage(models.Model):
    _name = "ai.chat.message"
    _description = "AI Chat Message"

    # 用户ID
    user_id = fields.Many2one("res.users", string="用户")
    #
    session_id = fields.Char(string="Session ID")
    # 消息内容
    content = fields.Text(string="消息内容")
    is_bot = fields.Boolean(string="是否是机器人消息", default=False)
    timestamp = fields.Datetime(string="时间戳", default=fields.Datetime.now)
