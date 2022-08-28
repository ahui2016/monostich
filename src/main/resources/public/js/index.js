$('title').text('index - monostich');

const Alerts = createAlerts();
const Loading = createLoading();

let searchHistoryArr = [];

const NaviBar = cc('div', { children: [
    span('monostich (v0.0.1) .. '),
    span('Index'),
]});

const PoemList = cc('div');

PoemList.clear = () => {
    PoemList.elem().html('');
}

const PoemGroupList = cc('div', {id: 'PoemGroupList'});

PoemGroupList.clear = () => {
    PoemGroupList.elem().html('');
}

const NaviLinks = cc('div', {classes: 'NaviLinks', children: [
    createLinkElem('/new-poem.html', {text: 'New'}),
    createLinkElem('/new-group.html', {text: 'NewGroup'}),
    createLinkElem(PoemGroupList.id, {text: 'Groups'}),
    createLinkElem('/config.html', {text: 'Config'}),
]});

const SearchInput = createInput();
const HistoryItems = cc('div', {classes: 'HistoryItems'});
const SubmitBtn = cc('button', {text: 'search'});
const SearchAlerts = createAlerts(4);

const SearchForm = cc('form', { children: [
    m(SearchInput),
    m(SubmitBtn).on('click', e => {
        e.preventDefault();
        const body = { pattern: valOf(SearchInput, 'trim') };
        if (body.pattern == '') {
            focus(SearchInput);
            return;
        }
        SearchAlerts.insert('primary', `正在检索: ${body.pattern}`);
        PoemList.clear();
        PoemGroupList.clear();
        axios.post('/api/search-poems', body)
            .then(resp => {
                const poems = resp.data;
                if (poems && poems.length > 0) {
                    SearchAlerts.insert('success', `找到 ${poems.length} 句话。`);
                    appendToList(PoemList, poems.map(PoemItem));
                } else {
                    SearchAlerts.insert('primary', '找不到句子。');
                }
            })
            .catch(err => {
                SearchAlerts.insert('danger', axiosErrToStr(err));
            });
        axios.post('/api/search-groups', body)
            .then(resp => {
                const groups = resp.data;
                if (groups && groups.length > 0) {
                    SearchAlerts.insert('success', `找到 ${groups.length} 个组合。`);
                    appendToList(PoemGroupList, groups.map(PoemGroupItem));
                }
            })
            .catch(err => {
                SearchAlerts.insert('danger', axiosErrToStr(err));
            });

        updateHistory(body);
    }),
    m(SearchAlerts),
]});

$('#root').append(
    m(NaviBar).addClass('text-large'),
    m(NaviLinks).addClass('text-right mr-1'),
    m(Loading).addClass('my-3').hide(),
    m(SearchForm).addClass('my-3'),
    m(HistoryItems),
    m(Alerts),
    m(PoemList).addClass('my-3'),
    m(PoemGroupList).addClass('my-3'),
);

init();

function init() {
    getRecentPoems();
    getRecentGroups();
    initSearchHistory();
}

function getRecentPoems() {
    Loading.show();
    axios.get('/api/recent-poems').then(resp => {
        const poems = resp.data;
        if (poems && poems.length > 0) {
            appendToList(PoemList, poems.map(PoemItem));
        } else {
            Alerts.insert('info', '空空如也');
        }
    })
    .catch(err => {
        Alerts.insert('danger', axiosErrToStr(err));
    })
    .then(() => {
        Loading.hide();
        focus(SearchInput);
    });
}

function getRecentGroups() {
    Loading.show();
    axios.get('/api/recent-groups').then(resp => {
        const groups = resp.data;
        if (groups && groups.length > 0) {
            appendToList(PoemGroupList, groups.map(PoemGroupItem));
        }
    })
    .catch(err => {
        Alerts.insert('danger', axiosErrToStr(err));
    })
    .then(() => {
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
    axios.get('/api/get-search-history')
        .then(resp => {
            searchHistoryArr = resp.data.filter(x => !!x);
            if (!resp.data || searchHistoryArr.length == 0) {
                return;
            }
            HistoryItems.show();
            refreshHistory();
        })
        .catch(err => {
            Alerts.insert('danger', axiosErrToStr(err));
        });
}

function refreshHistory() {
    HistoryItems.elem().html('');
    appendToList(HistoryItems, searchHistoryArr.map(HistoryItem));
}

function updateHistory(body) {
    const i = searchHistoryArr.findIndex(
        x => x.toLowerCase() === body.pattern.toLowerCase());
    if (i == 0) return;
    if (i > 0) searchHistoryArr.splice(i, 1);

    searchHistoryArr.unshift(body.pattern);
    if (searchHistoryArr.length > HistoryLimit) {
      searchHistoryArr.pop();
    }
    axios.post('/api/push-search-history', body)
        .then(() => {
            refreshHistory();
        })
        .catch(err => {
            Alerts.insert('danger', axiosErrToStr(err));
        });
}
