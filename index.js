import grid from './gridControls';
import './settingsMenu';
window.browser = (() => {
    return window.browser || window.chrome || window.msBrowser;
})();
// The toast box that can be used to show a message to the user.
const toastBox = document.querySelector("#toast");
const today = new Date();
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dateField = document.querySelector('#currDate');
dateField.innerText = `${weekdays[today.getDay()]} ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
function showToast(message) {
    if (toastBox !== null) {
        toastBox.innerText = message;
        toastBox.classList.remove('hidden');
        setTimeout(() => {
            toastBox.classList.add("hidden");
        }, 2000);
    }
}
let CTabGrid = grid();
CTabGrid.initialize();
// Save the grid and show the result to user using toastBox.
function saveGrid() {
    const saveResult = CTabGrid.saveGrid();
    showToast(saveResult);
}
const saveButton = document.querySelector("#saveButton");
saveButton.addEventListener('click', saveGrid);
/// Adding Widgets
const widgetTypeChanger = document.querySelector("#typeDropdown");
// Show or hide the title and url input fields in the simple add area.
function widgetTypeFieldVisibilityControl(showTitle, showUrl) {
    const hiddenClassName = "hidden";
    let title = document.querySelector("#addTitle");
    let titleLabel = document.querySelector("#titleLabel");
    let url = document.querySelector("#addUrl");
    let urlLabel = document.querySelector("#urlLabel");
    if (title !== null && titleLabel !== null && url !== null && urlLabel !== null) {
        let titleClassList = title.classList;
        let titleLabelClassList = titleLabel.classList;
        let urlClassList = url.classList;
        let urlLabelClassList = urlLabel.classList;
        if (showTitle) {
            titleClassList.remove(hiddenClassName);
            titleLabelClassList.remove(hiddenClassName);
        }
        else {
            titleClassList.add(hiddenClassName);
            titleLabelClassList.add(hiddenClassName);
        }
        if (showUrl) {
            urlClassList.remove(hiddenClassName);
            urlLabelClassList.remove(hiddenClassName);
        }
        else {
            urlClassList.add(hiddenClassName);
            urlLabelClassList.add(hiddenClassName);
        }
    }
}
if (widgetTypeChanger !== null) {
    widgetTypeChanger.addEventListener('change', () => {
        const curVal = widgetTypeChanger.value;
        if (curVal === "link") {
            widgetTypeFieldVisibilityControl(true, true);
        }
        if (curVal === "buienradar") {
            widgetTypeFieldVisibilityControl(false, false);
        }
        if (curVal === "clock") {
            widgetTypeFieldVisibilityControl(false, false);
        }
        if (curVal === "note") {
            widgetTypeFieldVisibilityControl(true, false);
        }
        if (curVal === "weather") {
            widgetTypeFieldVisibilityControl(false, false);
        }
    });
}
// New Add button
const addMenu = document.querySelector('#addMenu');
const floatingAddButton = document.querySelector('#floatingAddButton');
const addCancelButton = document.querySelector('#addCancelButton');
const widgetAddButton = document.querySelector('#widgetAddButton');
// Add the configured widget to the dashboard
function addWidget() {
    let title = document.querySelector("#addTitle");
    let url = document.querySelector("#addUrl");
    let bgcolor = document.querySelector('#addBGC');
    let textcolor = document.querySelector('#addTC');
    if (title !== null && url !== null && bgcolor !== null && textcolor !== null && widgetTypeChanger !== null && (title.value !== "" || widgetTypeChanger.value === "clock" || widgetTypeChanger.value === "weather" || widgetTypeChanger.value === "buienradar")) {
        CTabGrid.simpleAdd(widgetTypeChanger.value, { width: 1, height: 1 }, bgcolor.value, textcolor.value);
        title.value = "";
        url.value = "";
        // Trigger hiding of the add window
        if (addCancelButton !== null) {
            addCancelButton.click();
        }
    }
    else {
        showToast("Unable to add widget: A title is required.");
    }
}
if (addMenu !== null) {
    addMenu.classList.add('hidden');
}
if (widgetAddButton !== null && floatingAddButton !== null && addMenu !== null && addCancelButton !== null) {
    widgetAddButton.addEventListener('click', addWidget);
    floatingAddButton.addEventListener('click', () => {
        floatingAddButton.classList.add('hidden');
        addMenu.classList.remove('hidden');
    });
    addCancelButton.addEventListener('click', () => {
        floatingAddButton.classList.remove('hidden');
        addMenu.classList.add('hidden');
    });
}
// Accept the 'Enter' key as alternative to clicking on the 'Add' button with the mouse, when interacting with the 'addMenu'.
// Doesn't work for the background/text backgroundColor selectors as the browser seems to override the 'Enter' key for it (i.e. opens the backgroundColor palette).
['#typeDropdown', '#addTitle', '#addUrl', '#widgetAddButton'].forEach((item) => {
    const itemElem = document.querySelector(item);
    if (itemElem !== null) {
        itemElem.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                addWidget();
            }
        });
    }
});
/// Dev mode
const devConfigBox = document.querySelector("#devConfig");
const clearButton = document.querySelector("#clearButton");
const debugButton = document.querySelector("#debugButton");
const backupButton = document.querySelector("#backupButton");
const devEnabledCheckbox = document.querySelector("#devEnabled");
const devOpacityButton = document.querySelector("#opacityButton");
const configField = document.querySelector("#configFieldInput");
const devSaveButton = document.querySelector("#saveDevConfig");
//TODO: const loadBackupButton: HTMLButtonElement | null = document.querySelector('#loadBackupButton');
// Show or hide developer mode specific buttons
function devSwitch(displayStyle) {
    if (devConfigBox && clearButton && debugButton) {
        devConfigBox.style.display = displayStyle;
        devConfigBox.classList.remove("hidden");
        clearButton.style.display = displayStyle;
        debugButton.style.display = displayStyle;
    }
    // document.querySelector("#widescreenButton").style.display = displayStyle;
}
// disable dev mode by default
devSwitch('none');
clearButton.addEventListener('click', () => CTabGrid.debug(true, false));
debugButton.addEventListener('click', () => CTabGrid.debug(false, true));
backupButton.addEventListener('click', saveCurrentConfig);
devEnabledCheckbox.addEventListener('change', (a) => {
    if (a !== null && a.srcElement !== null)
        if (a.srcElement.checked) {
            devSwitch('block');
        }
        else {
            devSwitch('none');
        }
});
devSaveButton.addEventListener('click', () => {
    let config = JSON.parse(configField.value);
    CTabGrid.setConfig(config);
});
devOpacityButton.addEventListener('click', () => {
    let config = configField.value;
    configField.value = config.replace(/(backgroundColor":"rgba\([0-9]+,[0-9]+,[0-9]+,)([0-9.]+)((?=\)"))/gm, "$1 0.5$3");
});
configField.value = prettyPrintConfig(CTabGrid.getConfig());
const streamSaver = window.steamSaver;
function saveCurrentConfig() {
    const fileStream = streamSaver.createWriteStream('config.json');
    const writer = fileStream.getWriter();
    const encoder = new TextEncoder;
    let data = JSON.stringify(CTabGrid.getConfig());
    let uint8array = encoder.encode(data + "\n\n");
    writer.write(uint8array);
    writer.close();
}
function prettyPrintConfig(config) {
    if (config) {
        let result = "[";
        for (let i = 0; i < config.length; i++) {
            result += i === 0 ? "\n\t" : ",\n\t";
            result += JSON.stringify(config[i]);
        }
        return result + "\n]";
    }
    return "";
}
/// Chrome extension specific
try {
    window.browser.commands.onCommand.addListener(saveGrid);
    window.browser.bookmarks.onCreated.addListener(function (id, bookmark) {
        console.log("id", id);
        console.log("bookmark", bookmark);
        CTabGrid.simpleAdd("LinkWidget", { width: 1, height: 1, title: bookmark.title, url: bookmark.url }, "#fff", "#000");
    });
}
catch (e) {
    // not on chrome
    console.log("Did not execute chrome extension specific code");
}
//# sourceMappingURL=index.js.map