const Alerts = createAlerts();
const Loading = createLoading();

const NaviBar = cc('div', { children: [
    span('cmdcopy'),
    span(' .. '),
    span('index'),
]});

const CmdList = cc('div');

CmdList.clear = () => {
    CmdList.elem().html('');
}

const SearchInput = createInput();
const SubmitBtn = cc('button', {text: 'search'});
const SearchAlerts = createAlerts(4);

const SearchForm = cc('form', { children: [
    m(SearchInput),
    m(SubmitBtn).on('click', e => {
        e.preventDefault();
        const body = { pattern: valOf(SearchInput, 'trim') };
        SearchAlerts.insert('primary', `正在检索: ${body.pattern}`);
        axios.post('/api/search', body).then(resp => {
            const entries = resp.data;
            if (entries && entries.length > 0) {
                SearchAlerts.insert('success', `找到 ${entries.length} 条结果`);
                CmdList.clear();
                appendToList(CmdList, entries.map(CmdItem));
            } else {
                SearchAlerts.insert('info', '找不到。');
            }
        });
    }),
    m(SearchAlerts),
]});

$('#root').append(
    m(NaviBar).addClass('text-large'),
    m(Loading).addClass('my-3'),
    m(SearchForm).addClass('my-3'),
    m(Alerts),
    m(CmdList).addClass('my-3'),
);

init();

function init() {
    axios.get('/api/recent-entries').then(resp => {
        const entries = resp.data;
        if (entries && entries.length > 0) {
            appendToList(CmdList, entries.map(CmdItem));
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
