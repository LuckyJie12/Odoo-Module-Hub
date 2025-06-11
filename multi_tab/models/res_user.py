# -*- coding: utf-8 -*-
from odoo import api, fields, models


class ResUsers(models.Model):
    _inherit = "res.users"

    is_multiple_tags = fields.Boolean(string="Multiple Tags")

    def context_get(self):
        result = dict(super().context_get())

        # 从数据库中重新读取当前用户的 abcdefg 值，确保是最新的
        uid = self._uid or self.env.uid
        is_multiple_tags = (
            self.env["res.users"]
            .sudo()
            .browse(uid)
            .read(["is_multiple_tags"])[0]["is_multiple_tags"]
        )
        result["is_multiple_tags"] = is_multiple_tags
        return result
