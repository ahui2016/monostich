$('title').text('Index - Monostich');

const Alerts = createAlerts();
const Loading = createLoading();

const NaviBar = cc('div', { children: [
    createLinkElem('/', {text: 'Monostich'}),
    span(' .. '),
    span('Index'),
]});

const TitleList = cc('div', {classes: 'TitleList'});

TitleList.clear = () => {
    TitleList.elem().html('');
}

$('#root').append(
    m(NaviBar).addClass('text-large'),
    m(Loading).addClass('my-3'),
    m(Alerts).addClass('mt-2'),
    m(TitleList).addClass('my-5'),
);

init();

function init() {
    axiosGet('/api/get-config', Alerts, resp => {
        cfg = resp.data;
        reloadTitles(cfg.indexTitleLength);
    });
}

/**
 * @param {number} n
 */
function reloadTitles(n) {
    axiosPost('/api/get-truncated-titles', {val: n}, Alerts, resp => {
        const titles = resp.data;
        if (titles && titles.length > 0) {
            TitleList.clear();
            appendToList(TitleList, titles.map(TitleItem));
        } else {
            Alerts.insert('info', '空空如也');
        }
    },
    () => {
        Loading.hide();
    });
}

/**
 * @param {string} title
 * @returns {mjComponent}
 */
function TitleItem(title) {
    title = title.trim();
    const self = cc('div', {
        id: 'title-'+title,
        classes: 'TitleItem',
        text: title,
        children: [
            createLinkElem('/?pattern='+title, {text: title}),
        ],
    });

    self.init = () => {
        self.elem().on('click', e => {
            e.preventDefault();
            location.href = `/?pattern=${title}&prefix=yes`;
        });
    };

    return self;
}
