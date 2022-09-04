$('title').text('Config - Monostich');

let cfg;
let dbPath;

const Alerts = createAlerts();

const NaviBar = cc('div', { children: [
    createLinkElem('/', {text: 'Monostich'}),
    span(' .. '),
    span('Config'),
]});

const MaxRecentInput = createInput();
const ShowHistoryInput = createRadioCheck('checkbox', 'show-search-history');
const showHistoryBox = createBox(ShowHistoryInput, 'ShowSearchHistory');
const IndexTitleLength = createInput();

const DBPathInput = createInput();
const DBNameInput = createInput();
const ShowDBNameInput = createRadioCheck('checkbox', 'show-database-name');
const showDBNameBox = createBox(ShowDBNameInput, 'ShowDatabaseName');

const SubmitBtn = cc('button', {text: 'Submit', classes: 'btn btn-fat'});
const FormAlerts = createAlerts();

// 这个按钮是隐藏不用的，为了防止按回车键提交表单
const HiddenBtn = cc('button', { id: 'submit', text: 'submit' });

const Form = cc('form', {attr: {autocomplete: 'off'}, children: [
    createFormItem(MaxRecentInput, 'MaxRecent', '最近项目列表条数上限'),
    createFormBox(showHistoryBox, '是否显示最近搜索历史'),
    createFormItem(IndexTitleLength, 'IndexTitleLength', '索引标题的截取长度'),
    createFormItem(DBPathInput, 'DatabasePath', '切换数据库，可输入相对路径或绝对路径'),
    createFormItem(DBNameInput, 'DatabaseName', '数据库名称，可留空'),
    createFormBox(showDBNameBox, '是否在首页显示数据库名称'),
    m(FormAlerts).addClass('mb-3'),
    m(HiddenBtn).hide().on('click', e => {
        e.preventDefault();
        return false;
    }),
    m(SubmitBtn).on('click', event => {
        event.preventDefault();

        const maxRecentStr = valOf(MaxRecentInput, 'trim');
        const maxRecent = parseInt(maxRecentStr);
        if (!maxRecent) {
            FormAlerts.insert('danger', 'MaxRecent 必填，不可为零');
            focus(MaxRecentInput);
            return;
        }

        const dbPathVal = valOf(DBPathInput, 'trim');
        if (!dbPathVal) {
            FormAlerts.insert('danger', 'DatabasePath 必填');
            focus(DBPathInput);
            return;
        }

        const indexTitleLengthStr = valOf(IndexTitleLength, 'trim');
        const indexTitleLength = parseInt(indexTitleLengthStr);
        if (!indexTitleLength) {
            FormAlerts.insert('danger', 'IndexTitleLength 必填，不可为零');
            focus(IndexTitleLength);
            return;
        }

        const dbNameVal = valOf(DBNameInput, 'trim');

        const body = {
            maxRecent: maxRecent,
            showSearchHistory: ShowHistoryInput.elem().prop('checked'),
            indexTitleLength: indexTitleLength,
            databaseName: valOf(DBNameInput, 'trim'),
            showDatabaseName: ShowDBNameInput.elem().prop('checked'),
        };

        const body2 = {
            val: dbPathVal,
        };

        if (body.maxRecent == cfg.maxRecent
            && body.showSearchHistory == cfg.showSearchHistory
            && body.indexTitleLength == cfg.indexTitleLength
            && body.databaseName == cfg.databaseName
            && body.showDatabaseName == cfg.showDatabaseName)
        {
            FormAlerts.insert('info', 'Config 无变化');
        } else {
            if (dbPathVal != dbPath) {
                FormAlerts.insert('danger', 'DatabasePath 只能单独更改，不可与其它项目同时更改');
                return;
            }
            axiosPost('/api/update-config', body, FormAlerts, () => {
                FormAlerts.insert('success', 'config 更新成功！');
            });
        }

        if (dbPathVal == dbPath) {
            FormAlerts.insert('info', 'DatabasePath 无变化');
        } else {
            axiosPost('/api/change-db', body2, FormAlerts, () => {
                FormAlerts.insert('success', 'DatabasePath 切换成功！');
                FormAlerts.insert('info', '三秒后将自动刷新本页！');
                setTimeout(() => { location.reload() }, 3000);
            });
        }
    }),
]});

Form.init = () => {
    axiosGet('/api/get-config', Alerts, resp => {
        Form.show();
        cfg = resp.data;
        MaxRecentInput.elem().val(cfg.maxRecent);
        ShowHistoryInput.elem().prop('checked', cfg.showSearchHistory);
        IndexTitleLength.elem().val(cfg.indexTitleLength);
        DBNameInput.elem().val(cfg.databaseName);
        ShowDBNameInput.elem().prop('checked', cfg.showDatabaseName);
    });

    axiosGet('/api/get-db-path', Alerts, resp => {
        dbPath = resp.data.val;
        DBPathInput.elem().val(dbPath);
    });
};

$('#root').append(
    m(NaviBar).addClass('my-3'),
    m(Alerts).addClass('my-3'),
    m(Form).hide(),
);
    
init();

function init() {
    Form.init();
}
