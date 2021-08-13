 
browser.menus.create({
    contexts: ["all", "tab"],
    id: "newtab_clipboard",
    title: `New tab open clipboard URL`,
    icons: {"32": "icon.svg"}
});

var url = "";

browser.menus.onShown.addListener(async function(info, tab) {
    const tabid = tab.id;
    const wid = tab.windowId;
    
    var show = false;
    var clipboard = (await navigator.clipboard.readText() ).trim() ;
    if ( clipboard)
    {
        if ( clipboard.indexOf("://") != -1)
        {
            var possible_scheme = clipboard.substring(0, clipboard.indexOf("://") ) ;
            if ( /^[a-z][a-z0-9+.\-]*/i.test(possible_scheme))
                url = clipboard;
            else
                url = "http://" + clipboard
        }else
            url = "http://" + clipboard
            
        show = true;
    }else{
        url = "";
        show = false;
    }
    browser.menus.update("newtab_clipboard", {title: `New tab: ${url}` , visible: show});

    // Note: Not waiting for returned promise.
    browser.menus.refresh();
});

browser.menus.onClicked.addListener((info, tab) => {
    const tabid = tab.id;
    const wid = tab.windowId;
    const menuItemId = info.menuItemId;

    switch ( menuItemId ){
        case "newtab_clipboard":
            browser.tabs.create({url: url, active: true})
        break;

    }
});
