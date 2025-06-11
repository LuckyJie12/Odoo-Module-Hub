import { Component, onWillDestroy, useState } from "@odoo/owl";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";

const HOME_TAB_ID = 1000;
const STUDIO_TAG = "studio";
const MENU_TAG = "menu";
const BLANK_COMPONENT_NAME = "BlankComponent";
const DEFAULT_TAB_TITLE = "New Tab";
const HOME_TAB_TITLE = "首页";

export class MultiTabs extends Component {
  static template = "multi_tab.multi_tabs";
  static props = ["*"];
  
  setup() {
    this.tabIdCounter = 1;
    this.state = useState({
      tabs: [],
      activeTabId: null,
      blankTab: {
        Component: null,
        componentProps: null,
      },
    });
    
    this.menuService = useService("menu");
    this.actionService = useService("action");
    this.actionServiceDef = registry.category("services").get("action");
    
    // 获取导航组件
    this.navComponent = this.__owl__.parent.children.__1.component;
    
    this.env.bus.addEventListener("ACTION_MANAGER:UPDATE", this.handleActionUpdate);
    onWillDestroy(() => {
      this.env.bus.removeEventListener("ACTION_MANAGER:UPDATE", this.handleActionUpdate);
    });
  }
  
  handleActionUpdate = ({ detail: actionInfo }) => {
    this.tabIdCounter++;
    
    const currentApp = this.menuService.getCurrentApp();
    const currentAppName = currentApp?.name || DEFAULT_TAB_TITLE;
    const isBlankTab = actionInfo.Component?.name === BLANK_COMPONENT_NAME;
    
    if (isBlankTab) {
      this.handleBlankTab(actionInfo);
    } else {
      this.handleRegularTab(actionInfo, currentApp, currentAppName);
    }
  };
  
  handleBlankTab(actionInfo) {
    const { blankTab } = this.state;
    blankTab.Component = actionInfo.Component;
    blankTab.componentProps = actionInfo.componentProps;
  }
  
  handleRegularTab(actionInfo, currentApp, currentAppName) {
    const { tabs, blankTab } = this.state;
    blankTab.Component = null;
    blankTab.componentProps = null;
    
    const appId = currentApp?.id || HOME_TAB_ID;
    const isHomeTab = actionInfo.componentProps.action?.tag === MENU_TAG;
    const isStudioTab = actionInfo.componentProps.action?.tag === STUDIO_TAG;
    
    const existingHomeTab = tabs.find(tab => tab.appId === HOME_TAB_ID);
    const existingAppTab = tabs.find(tab => tab.appId === appId);
    
    if (isHomeTab) {
      this.handleHomeTab(actionInfo, existingHomeTab);
    } else if (isStudioTab) {
      this.handleStudioTab(actionInfo, existingAppTab);
    } else {
      this.handleNewAppTab(actionInfo, currentAppName, appId, existingAppTab);
    }
    
    this.updateNavigationState();
  }
  
  handleHomeTab(actionInfo, existingHomeTab) {
    const { tabs } = this.state;
    
    if (existingHomeTab) {
      const tabIndex = tabs.findIndex(tab => tab.appId === HOME_TAB_ID);
      tabs.splice(tabIndex, 1);
    }
    
    const homeTab = {
      ...actionInfo,
      id: this.tabIdCounter,
      title: HOME_TAB_TITLE,
      appId: HOME_TAB_ID,
    };
    
    tabs.unshift(homeTab);
    this.state.activeTabId = this.tabIdCounter;
    this.initializeActionServiceAsync(homeTab);
  }
  
  handleStudioTab(actionInfo, existingAppTab) {
    if (!existingAppTab) return;
    
    Object.assign(existingAppTab, {
      ...existingAppTab,
      Component: actionInfo.Component,
      componentProps: actionInfo.componentProps,
    });
  }
  
  handleNewAppTab(actionInfo, title, appId, existingAppTab) {
    const { tabs } = this.state;
    
    if (existingAppTab) {
      existingAppTab.appId = appId;
      Object.assign(existingAppTab, {
        ...existingAppTab,
        Component: actionInfo.Component,
        componentProps: actionInfo.componentProps,
        title: title,
      });
      this.menuService.setCurrentMenu(appId);
      this.state.activeTabId = existingAppTab.id;
    } else {
      const newTab = {
        ...actionInfo,
        id: this.tabIdCounter,
        title: title,
        appId: appId,
      };
      
      tabs.push(newTab);
      this.state.activeTabId = this.tabIdCounter;
      this.initializeActionServiceAsync(newTab);
    }
  }
  
  initializeActionServiceAsync(tab) {
    setTimeout(() => {
      tab.actionService = this.env.services.action;
    }, 300);
  }
  
  activateTab(id) {
    this.state.activeTabId = id;
    
    const activeTab = this.state.tabs.find(tab => tab.id === id);
    if (!activeTab) return;
    
    if (activeTab.appId === HOME_TAB_ID) {
      activeTab.actionService = this.actionServiceDef.start(this.env);
    }
    
    this.env.services.action = activeTab.actionService;
    this.menuService.setCurrentMenu(activeTab.appId);
    this.updateNavigationState();
  }
  
  closeTab(tabId) {
    const { tabs, activeTabId } = this.state;
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    
    if (tabIndex === -1) return;
    
    tabs.splice(tabIndex, 1);
    
    if (activeTabId === tabId) {
      const nextTab = tabs[tabIndex] || tabs[tabIndex - 1];
      this.state.activeTabId = nextTab ? nextTab.id : null;
    }
    
    this.updateNavigationState();
  }
  
  updateNavigationState() {
    const { activeTabId, tabs } = this.state;
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    const currentApp = this.menuService.getCurrentApp();
    
    if (!activeTab) return;
    
    if (activeTab.componentProps?.action?.tag === MENU_TAG) {
      this.navComponent.hm.hasHomeMenu = true;
      activeTab.title = HOME_TAB_TITLE;
    } else {
      this.navComponent.hm.hasHomeMenu = false;
      activeTab.title = currentApp?.name || DEFAULT_TAB_TITLE;
    }
    
    document.body.classList.toggle("o_home_menu_background", this.navComponent.hm.hasHomeMenu);
  }
  
  get tabs() {
    return this.state.tabs;
  }
  
  get activeTabId() {
    return this.state.activeTabId;
  }
}