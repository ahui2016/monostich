$('title').text('Home - Monostich');

const prefixOnly = getUrlParam('prefix');

const Alerts = createAlerts();
const Loading = createLoading();

// 要注意与 util.java SearchHistory maxSearchHistory 一致。
const HistoryLimit = 20;

let searchHistoryArr = [];

const NaviBar = cc('div', { children: [
    span('Monostich (v0.0.6) .. '),
    span('Home '),
    createLinkElem('/', {text: '(reload)'}),
]});

const DBName = cc('div');

const NewBtn = cc('a', {id: 'show-poem-form-btn', text: 'New', attr:{href: '#'}});
const NaviLinks = cc('div', {classes: 'NaviLinks', children: [
    m(NewBtn).on('click', e => {
        e.preventDefault();
        PoemForm.show();
        NewBtn.hide();
        focus(PoemInput);
    }),
    createLinkElem('/title-index.html', {text: 'Index'}),
    createLinkElem('/config.html', {text: 'Config'}),
]});

const PoemList = cc('div');

PoemList.clear = () => {
    PoemList.elem().html('');
}

const HistoryItems = cc('div', {classes: 'HistoryItems'});
const HistoryArea = cc('div', {classes: 'HistoryArea', children: [
    span('Recent: ').addClass('text-grey'),
    m(HistoryItems),
    createLinkElem('#', {text: '(clear)'}).on('click', e => {
        axiosGet('/api/clear-search-history', Alerts, () => {
            searchHistoryArr = [];
            refreshHistory();
        });
    }),
]});

const SearchInput = createInput();
const SubmitBtn = cc('button', {text: 'search'});
const SearchAlerts = createAlerts();

const SearchForm = cc('form', { children: [
    m(SearchInput).addClass('SearchInput'),
    m(SubmitBtn).addClass('ml-1 btn btn-fat').on('click', e => {
        e.preventDefault();
        const body = {
            pattern: valOf(SearchInput, 'trim'),
            prefixOnly: prefixOnly == 'yes',
        };
        if (body.pattern == '') {
            focus(SearchInput);
            return;
        }
        SearchAlerts.insert('primary', `正在检索: ${body.pattern}`);
        if (body.prefixOnly) {
            SearchAlerts.insert('info', '注意：正在采用 "仅前缀匹配" 模式。点击 (reload) 恢复正常搜索。');
        }

        PoemList.clear();
        Loading.show();
        axiosPost('/api/search-poems', body, SearchAlerts, resp => {
            const poems = resp.data;
            if (poems && poems.length > 0) {
                SearchAlerts.insert('success', `找到 ${poems.length} 条记录。`);
                appendToList(PoemList, poems.map(PoemItem));
                NewBtn.show();
                PoemForm.hide();
            } else {
                SearchAlerts.insert('primary', '找不到。');
            }
        },
        () => {
            Loading.hide();
        });
        updateHistory({val: body.pattern});
    }),
    m(SearchAlerts).addClass('mt-2'),
]});

const PoemInput = createTextarea(5);
const PostBtn = cc('button', {text: 'Post', classes: 'btn btn-fat'});
const FormAlerts = createAlerts();

// 这个按钮是隐藏不用的，为了防止按回车键提交表单
const HiddenBtn2 = cc('button', { id: 'submit', text: 'submit' });

const PoemForm = cc('div', { children: [
    m(PoemInput).attr({autocomplete: 'off'})
                .addClass("mb-1 form-textinput form-textinput-fat"),
    m(HiddenBtn2).hide().on('click', e => {
        e.preventDefault();
        return false;
    }),
    m('div').addClass('PostBtnArea').append(
        m(PostBtn).on('click', event => {
            event.preventDefault();
            const content = valOf(PoemInput, 'trim');
            if (!content) {
                focus(PoemInput);
                return;
            }
            const lines = content.split(/\r?\n/)
                    .map(s => s.trim())
                    .filter(x => !!x);

            const title = lines.shift();
            let stich = "";
            if (lines.length > 0) {
                stich = lines.join('\n');
            }
            const body = {
                title: title,
                stich: stich,
            };
            axiosPost('/api/insert-poem', body, Alerts, resp => {
                PoemInput.elem().val('');
                const poem = PoemItem(resp.data);
                PoemList.elem().prepend(m(poem));
                poem.init();
                focus(PoemInput);
            });
        }),
    ),
    m(FormAlerts).addClass('mb-3'),
]});

$('#root').append(
    m(NaviBar).addClass('text-large'),
    m(DBName),
    m(NaviLinks).addClass('text-right mr-1'),
    m(Alerts).addClass('my-3'),
    m(SearchForm).addClass('my-3'),
    m(HistoryArea).hide(),
    m(PoemForm).addClass('my-3').hide(),
    m(Loading).addClass('my-3'),
    m(PoemList).addClass('my-3'),
);

init();

function init() {
    getDatabaseName();

    const pattern = getUrlParam('pattern');
    if (pattern) {
        searchUrlParam(pattern.trim());
    } else {
        getRecentPoems();
    }

    initSearchHistory();
}

function getDatabaseName() {
    axiosGet('/api/get-config', Alerts, resp => {
        cfg = resp.data;
        if (cfg.showDatabaseName && cfg.databaseName) {
            DBName.elem().text(cfg.databaseName);
        }
    });
}

function searchUrlParam(pattern) {
    SearchInput.elem().val(pattern);
    SubmitBtn.elem().trigger('click');
}

function getRecentPoems() {
    axiosGet('/api/recent-poems', Alerts, resp => {
        const poems = resp.data;
        if (poems && poems.length > 0) {
            appendToList(PoemList, poems.map(PoemItem));
        } else {
            Alerts.insert('info', '空空如也');
        }
    },
    () => {
        Loading.hide();
        focus(SearchInput);
    });
}

function HistoryItem(h) {
    const self = cc('a', {text: h, attr: {href: '#'}, classes: 'HistoryItem'});
    self.init = () => {
        self.elem().on('click', e => {
            e.preventDefault();
            SearchInput.elem().val(h);
            SubmitBtn.elem().trigger('click');
        });
    };
    return self;
}

function initSearchHistory() {
    axiosGet('/api/get-search-history', Alerts, resp => {
        searchHistoryArr = resp.data.filter(x => !!x);
        if (!resp.data || searchHistoryArr.length == 0) {
            return;
        }
        refreshHistory();
    });
}

function refreshHistory() {
    HistoryItems.elem().html('');
    if (searchHistoryArr.length == 0) {
        HistoryArea.hide();
        return;
    }
    HistoryArea.show();
    prependToList(HistoryItems, searchHistoryArr.map(HistoryItem));
}

function updateHistory(body) {
    axiosPost('/api/push-search-history', body, Alerts, resp => {
        searchHistoryArr = resp.data;
        refreshHistory();
    });
}
