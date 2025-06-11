{
    "name": "Multi Tab",
    "summary": "Tab标签页",
    "description": "Tab标签页",
    "author": "LuckyJie",
    "website": "https://github.com/LuckyJie12/Odoo-Module-Hub.git",
    "category": "Tools/Multi Tab",
    "version": "18.0.0.1",
    "depends": ["base", "web"],
    "data": [
        "views/res_user.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "multi_tab/static/src/**/*",
        ]
    },
    "installable": True,
    "application": True,
    'license': 'AGPL-3'
}
