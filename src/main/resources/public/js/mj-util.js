// 这些 class 只是为了方便生成文档，不实际使用。
class LinkOptions {}
class AxiosError {}

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const GROUP_POEMS_LENGTH_LIMIT = 60;

// 获取地址栏的参数。
function getUrlParam(param) {
  const queryString = new URLSearchParams(document.location.search);
  return queryString.get(param);
}

/**
 * @param obj is a mjComponent or the mjComponent's id
 */
function disable(obj) {
    const id = typeof obj == "string" ? obj : obj.id;
    const nodeName = $(id).prop("nodeName");
    if (nodeName == "BUTTON" || nodeName == "INPUT") {
        $(id).prop("disabled", true);
    }
    else {
        $(id).css("pointer-events", "none");
    }
}

/**
 * @param obj is a mjComponent or the mjComponent's id
 */
function enable(obj) {
    const id = typeof obj == "string" ? obj : obj.id;
    const nodeName = $(id).prop("nodeName");
    if (nodeName == "BUTTON" || nodeName == "INPUT") {
        $(id).prop("disabled", false);
    }
    else {
        $(id).css("pointer-events", "auto");
    }
}

/**
 * @param {string} text 
 * @returns {mjElement}
 */
function span(text) {
    return m('span').text(text);
}

/**
 * @param {mjComponent} list 
 * @param {mjComponent[]} items 
 */
function prependToList(list, items) {
    items.forEach(item => {
        list.elem().prepend(m(item));
        if (item.init) item.init();
    });
}

/**
 * @param {mjComponent} list 
 * @param {mjComponent[]} items 
 */
function appendToList(list, items) {
    items.forEach(item => {
        list.elem().append(m(item));
        if (item.init) item.init();
    });
}

/**
 * @param {"center"?} align 目前只接受 "center", 不接受其他值。
 */
function createLoading(align) {
    let classes = "Loading";
    if (align == "center") {
        classes += " text-center";
    }
    return cc("div", {
        text: "Loading...",
        classes: classes,
    });
}

/**
 * 当 max <= 0 时，不限制数量。
 * msgType: "success" | "danger" | "info" | "primary"
 * @param {number} max default = 3
 */
function createAlerts(max = 3) {
    const alerts = cc("div");
    alerts.max = max;
    alerts.count = 0;

    alerts.insertElem = (elem) => {
        $(alerts.id).prepend(elem);
        alerts.count++;
        if (alerts.max > 0 && alerts.count > alerts.max) {
            $(`${alerts.id} div:last-of-type`).remove();
        }
    };

    /**
     * @param {"success" | "danger" | "info" | "primary"} msgType
     */
    alerts.insert = (msgType, msg) => {
        const time = dayjs().format("HH:mm:ss");
        const time_and_msg = `${time} ${msg}`;

        if (msgType == "danger") {
            console.log(time_and_msg);
        }

        const elem = m("div")
            .addClass(`alert alert-${msgType} my-1`)
            .append(span(time_and_msg));

        alerts.insertElem(elem);
    };

    alerts.clear = () => {
        $(alerts.id).html("");
        alerts.count = 0;
        return alerts;
    };

    return alerts;
}

/**
 * @param {mjElement | mjComponent} obj
 * @param {"trim"?} trim
 * @returns {string}
 */
function valOf(obj, trim) {
    let s = "elem" in obj ? obj.elem().val() : obj.val();
    return trim == "trim" ? s.trim() : s;
}

/**
 * @param {mjElement | mjComponent} obj
 */
function focus(obj) {
    if ("elem" in obj) obj = obj.elem();
    setTimeout(() => { obj.trigger("focus") }, 300);
}

/*
interface LinkOptions {
    text?: string;
    title?: string;
    blank?: boolean;
}
*/

/**
 * @param {string} href 
 * @param {LinkOptions?} options LinkOptions{text?: string, title?: string, blank?: "blank"}
 * @returns {mjElement}
 */
function createLinkElem(href, options) {
    if (!options) {
        return m("a").text(href).attr("href", href);
    }
    if (!options.text) options.text = href;
    const link = m("a").text(options.text).attr("href", href);
    if (options.title) link.attr("title", options.title);
    if (options.blank == "blank") link.attr("target", "_blank");
    return link;
}

/**
 * @param {string} type default = "text"
 * @returns {mjComponent}
 */
function createInput(type = "text") {
    return cc("input", { attr: { type: type } });
}

/**
 * @param {number} rows default = 3
 * @returns {mjComponent}
 */
function createTextarea(rows = 3) {
    return cc("textarea", { classes: "form-textarea", attr: { rows: rows } });
}

/**
 * 主要用来给 input 或 textarea 包裹一层。
 * @param {mjComponent} comp 主是是用 createInput 或 createTextarea 函数生成的组件。
 * @param {string} name 
 * @param {string | mjElement} description 
 * @param {string} classes default = "mb-3"
 * @returns {mjElement}
 */
function createFormItem(comp, name, description, classes = "mb-3") {
    let descElem = description;
    if (typeof description == "string") {
        descElem = m("div").addClass("form-text").text(description);
    }
    return m("div")
        .addClass(classes)
        .append(
            m("label").addClass("form-label").attr({ for: comp.raw_id }).text(name),
            m(comp).addClass("form-textinput form-textinput-fat"),
            descElem
        );
}

/**
 * @param {string} name
 * @returns {mjElement}
 */
function createBadge(name) {
    return span(name).addClass("badge-grey");
}

/**
 * Creates a radio button or checkbox component.
 * @param {"radio" | "checkbox"} type 
 * @param {string} name 
 * @param {"checked"?} checked 
 * @returns {mjComponent}
 */
function createRadioCheck(type, name, checked) {
    const c = checked == "checked" ? true : false;
    return cc("input", {
        attr: { type: type, name: name },
        prop: { checked: c },
    });
}

/**
 * 用一个 div 包装一下 radio button 或 checkbox.
 * 其中 item 用 createRadioCheck 函数生成。
 * @param {mjComponent} item is a radio button or a checkbox
 * @param {string} label 
 * @param {string?} title 
 * @param {string?} value 通常等于 label, 因此不常用
 * @returns {mjElement}
 */
function createBox(item, label, title, value) {
    value = value ? value : label;
    return m("div")
        .addClass("form-check-inline")
        .append(
            m(item).attr({value: value, title: title}),
            m("label").text(label).attr({for: item.raw_id, title: title})
        );
}

/**
 * https://axios-http.com/docs/handling_errors
 * @param {AxiosError} err 
 * @returns {string}
 */
function axiosErrToStr(err) {
    if (err.response) {
        return `${err.response.status}: ${err.response.data.title}`;
    }
    if (err.request) {
        return err.request.status + ':The request was made but no response was received.';
    }
    return err.message;
}

/**
 * 如果 id 以数字开头，就需要使用 elemID 给它改成以字母开头，
 * 因为 DOM 的 ID 不允许以数字开头。
 * @param {string} id
 * @returns {string}
 */
function elemID(id) {
    return `e${id}`;
}

/**
 * @param {string} s 
 * @param {string} alertsID
 */
 function copyToClipboard(s, alerts) {
    navigator.clipboard.writeText(s).then(() => {
        if (alerts) alerts.insert('success', '复制成功');
    }, () => {
        if (alerts) alerts.insert('danger', '复制失败');
    });
}

/**
 * @param {string} items 
 * @returns {string}
 */
function items_replace(items) {
    if (!items) return '';
    return items.replace(/[#;,，'"\/\+\n]/g, ' ').trim();
}

/**
 * @param {string} items 
 * @returns {string[]}
 */
function itemsStringToArray(items) {
    items = items_replace(items);
    return items.split(/ +/).filter(x => !!x);
}

/**
 * @param {string[]} arr 
 * @param {string} s 
 * @returns number
 */
function noCaseIndexOf(arr, s) {
    return arr.findIndex(x => x.toLowerCase() === s.toLowerCase());
}
  
/**
 * @param {string[]} items 
 * @returns {string[]}
 */
function uniqueKeepOrder(items) {
    return items
        .filter(x => !!x)
        .filter((v, i, a) => noCaseIndexOf(a, v) === i);
}

/**
 * 截短字符串，使 s 的长度不超过 i, 如果超过就截短。
 * @param {string} s
 * @param {number} i 长度上限
 * @returns {string} 
 */
function truncate(s, i) {
    if (s.length <= i) return s;
    return s.substring(0, i) + ' ...';
}
