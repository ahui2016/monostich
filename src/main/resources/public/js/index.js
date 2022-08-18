const Alerts = createAlerts();
const Loading = createLoading();

const NaviBar = cc('div', { children: [
    span('cmdcopy'),
    span(' .. '),
    span('index'),
]});

const CmdList = cc('div');

$('#root').append(
    m(NaviBar),
    m(Loading).addClass('my-3'),
    m(Alerts),
    m(CmdList).addClass('my-3'),
);

init();

function init() {
    axios.get('/api/all-entries').then(resp => {
        const all = resp.data;
        if (all && all.length > 0) {
            appendToList(CmdList, all.map(CmdItem));
        } else {
            Alerts.insert('info', '空空如也');
        }
    })
    .catch(err => {
        Alerts.insert('danger', axiosErrToStr(err));
    })
    .then(() => {Loading.hide()});
}
