import { Component, useState, markup, onMounted, onWillUnmount, onWillStart, useRef } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { loadJS } from "@web/core/assets";

export class ChatWindow extends Component {
    static template = "ai_chat.ChatWindow";
    static components = {};
    static props = ["*"];
    setup() {
        this.generateresponse = useService("generateresponse");
        this.state = useState({
            inputText: "", // 响应式变量
            messages: [],
            isLoading: false,
            userName: "Admin",
        });
        this.messageContainer = useRef("messageContainer");
        // 自动滚动到底部
        onMounted(() => {
            // 读取本地存储的聊天记录
            const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            this.state.messages = chatHistory.map(msg => ({
                ...msg,
                content: markup(msg.content) // 重建为可渲染对象
            }));
            this.scrollToBottom();
        });
        // 离开页面时保存聊天信息
        onWillUnmount(() => {
            this.saveChatHistory();
        })
        // 初始化Markdown渲染引擎
        this.md = window.markdownit({
            html: true,
            highlight: (str, lang) => {
                if (lang && window.hljs.getLanguage(lang)) {
                    try {
                        const highlighted = window.hljs.highlight(str, {
                            language: lang,
                            ignoreIllegals: true
                        }).value;
                        return `<pre><code class="hljs ${lang}">${this.addLineNumbers(highlighted)}</code></pre>`;
                    } catch { }
                }
                return `<pre><code>${this.md.utils.escapeHtml(str)}</code></pre>`;
            }
        });
    }
    // 行号添加方法
    addLineNumbers(code) {
        return code.split('\n').map(line =>
            `<span>${line || ' '}</span>`
        ).join('\n');
    }
    saveChatHistory() {
        const chatHistory = this.state.messages.map(message => ({
            content: message.content,
            type: message.type,
            timestamp: message.timestamp
        }));
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
    // 发送消息处理
    async sendMessage() {
        if (!this.state.inputText.trim() || this.state.isLoading) return;

        const userMessage = {
            content: this.state.inputText,
            type: 'user',
            timestamp: new Date().toLocaleTimeString()
        };

        this.state.messages.push(userMessage);
        this.state.inputText = "";
        this.state.isLoading = true;
        this.scrollToBottom();
        try {
            const aiResponse = await this.generateresponse.loadData(userMessage.content);
            const dirtyHtml = this.md.render(aiResponse);
            const cleanHtml = window.DOMPurify.sanitize(dirtyHtml);
            this.state.messages.push({
                content: markup(cleanHtml),
                type: 'ai',
                timestamp: new Date().toLocaleTimeString()
            });

        } catch (error) {
            this.state.messages.push({
                content: "Sorry, there was an error processing your request.",
                type: 'error'
            });
        } finally {
            this.state.isLoading = false;
            this.scrollToBottom();
        }
    }

    // 处理键盘事件
    handleKeyPress(ev) {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            this.sendMessage();
        }
    }

    // 滚动到底部
    scrollToBottom() {
        setTimeout(() => {
            const container = this.messageContainer.el;
            if (container) {
                // 使用平滑滚动API
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'  // 平滑滚动效果
                });
            }
        }, 50); // 50ms等待OWL渲染周期
    }
}

registry.category("actions").add("ai_chat.chatwindow", ChatWindow);