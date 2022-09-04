$('title').text('Home - Monostich');

const Alerts = createAlerts();
const Loading = createLoading();

// 要注意与 util.java SearchHistory maxSearchHistory 一致。
const HistoryLimit = 20;

let searchHistoryArr = [];

const NaviBar = cc('div', { children: [
    span('Monostich (v0.0.4) .. '),
    span('Home '),
    createLinkElem('/', {text: '(reload)'}),
]});

const DBName = cc('div');

const NaviLinks = cc('div', {classes: 'NaviLinks', children: [
    createLinkElem('/new-poem.html', {text: 'New'}),
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
        const body = { val: valOf(SearchInput, 'trim') };
        if (body.val == '') {
            focus(SearchInput);
            return;
        }
        SearchAlerts.insert('primary', `正在检索: ${body.val}`);

        PoemList.clear();
        Loading.show();
        axiosPost('/api/search-poems', body, SearchAlerts, resp => {
            const poems = resp.data;
            if (poems && poems.length > 0) {
                SearchAlerts.insert('success', `找到 ${poems.length} 条记录。`);
                appendToList(PoemList, poems.map(PoemItem));
            } else {
                SearchAlerts.insert('primary', '找不到。');
            }
        },
        () => {
            Loading.hide();
        });
        updateHistory(body);
    }),
    m(SearchAlerts).addClass('mt-2'),
]});

$('#root').append(
    m(NaviBar).addClass('text-large'),
    m(DBName),
    m(NaviLinks).addClass('text-right mr-1'),
    m(SearchForm).addClass('my-3'),
    m(HistoryArea).hide(),
    m(Alerts).addClass('mt-2'),
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
