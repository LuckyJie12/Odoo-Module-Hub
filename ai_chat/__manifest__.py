# -*- coding: utf-8 -*-
{
    'name': "AIChat",
    'summary': """AI聊天助手""",
    'description': """
        AI聊天助手
        该模块是一个AI聊天助手的起始模块，旨在帮助用户与AI进行交互。"
    """,
    'author': "LuckyJie",
    "website": "https://github.com/LuckyJie12/Odoo-Module-Hub.git",
    'category': 'Tools/AIChat',
    'version': '18.0.0.1',
    'depends': ['base', 'web'],
    'application': True,
    'installable': True,
    'data': [
        'views/views.xml',
        "views/chat_message_views.xml",
        "views/settings_views.xml",
        "security/ir.model.access.csv"
    ],
    'assets': {
        'web.assets_backend': [
            'ai_chat/static/src/**/*',
            'ai_chat/static/lib/**/*',
        ],
    },
    'license': 'AGPL-3'
}
