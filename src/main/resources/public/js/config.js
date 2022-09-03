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
const ShowHistoryInput = createRadioCheck('checkbox', 'showSearchHistory', 'checked');
const showHistoryBox = createBox(ShowHistoryInput, 'showSearchHistory');
const IndexTitleLength = createInput();

const DBPathInput = createInput();
const SubmitBtn = cc('button', {text: 'Submit', classes: 'btn btn-fat'});
const FormAlerts = createAlerts();

// 这个按钮是隐藏不用的，为了防止按回车键提交表单
const HiddenBtn = cc('button', { id: 'submit', text: 'submit' });

const Form = cc('form', {attr: {autocomplete: 'off'}, children: [
    createFormItem(MaxRecentInput, 'MaxRecent', '最近项目列表条数上限'),
    m('div').addClass('mb-3').append(
        showHistoryBox,
        m('div').addClass('form-text').text('是否显示最近搜索历史'),
    ),
    createFormItem(IndexTitleLength, 'IndexTitleLength', '索引标题的截取长度'),
    createFormItem(DBPathInput, 'DatabasePath', '切换数据库，可输入相对路径或绝对路径'),
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

        const body = {
            maxRecent: maxRecent,
            showSearchHistory: ShowHistoryInput.elem().prop('checked'),
            indexTitleLength: indexTitleLength,
        };

        const body2 = {
            val: dbPathVal,
        };

        if (body.maxRecent == cfg.maxRecent
            && body.showSearchHistory == cfg.showSearchHistory
            && body.indexTitleLength == cfg.indexTitleLength)
        {
            FormAlerts.insert('info', 'Config 无变化');
        } else {
            axiosPost('/api/update-config', body, FormAlerts, () => {
                FormAlerts.insert('success', 'config 更新成功！');
            });
        }

        if (dbPathVal == dbPath) {
            FormAlerts.insert('info', 'DatabasePath 无变化');
        } else {
            axiosPost('/api/change-db', body2, FormAlerts, () => {
                FormAlerts.insert('success', 'DatabasePath 切换成功！');
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
