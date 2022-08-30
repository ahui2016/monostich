$('title').text('Config - monostich');

let cfg;
let dbPath;

const Alerts = createAlerts();

const NaviBar = cc('div', { children: [
    createLinkElem('/', {text: 'monostich'}),
    span(' .. '),
    span('Config'),
]});

const MaxRecentInput = createInput();
const ShowHistoryInput = createRadioCheck('checkbox', 'showSearchHistory', 'checked');
const showHistoryBox = createBox(ShowHistoryInput, 'showSearchHistory');
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
    createFormItem(DBPathInput, 'DatabasePath', '切换数据库，可输入相对路径或绝对路径'),
    m(FormAlerts).addClass('mb-3'),
    m(HiddenBtn).hide().on('click', e => {
        e.preventDefault();
        return false;
    }),
    m(SubmitBtn).on('click', event => {
        event.preventDefault();

        const maxRecentStr = valOf(MaxRecentInput, 'trim');
        if (!maxRecentStr) {
            FormAlerts.insert('danger', 'Title必填');
            focus(MaxRecentInput);
            return;
        }

        const dbPathVal = valOf(DBPathInput, 'trim');
        if (!dbPathVal) {
            FormAlerts.insert('danger', 'DatabasePath必填');
            focus(DBPathInput);
            return;
        }

        const body = {
            maxRecent: parseInt(maxRecentStr),
            showSearchHistory: ShowHistoryInput.elem().prop('checked'),
        };

        const body2 = {
            val: dbPathVal,
        };

        if (body.maxRecent == cfg.maxRecent && body.showSearchHistory == cfg.showSearchHistory) {
            FormAlerts.insert('info', 'Config 无变化');
        } else {
            axios.post('/api/update-config', body)
                .then(() => {
                    FormAlerts.insert('success', 'config 更新成功！');
                })
                .catch(err => {
                    FormAlerts.insert('danger', axiosErrToStr(err));
                });
        }

        if (dbPathVal == dbPath) {
            FormAlerts.insert('info', 'DatabasePath 无变化');
        } else {
            axios.post('/api/change-db', body2)
                .then(() => {
                    FormAlerts.insert('success', 'DatabasePath 切换成功！');
                })
                .catch(err => {
                    FormAlerts.insert('danger', axiosErrToStr(err));
                });
        }
    }),
]});

Form.init = () => {
    axios.get('/api/get-config')
        .then(resp => {
            Form.show();
            cfg = resp.data;
            MaxRecentInput.elem().val(cfg.maxRecent);
            ShowHistoryInput.elem().prop('checked', cfg.showSearchHistory);
        })
        .catch(err => {
            Alerts.insert('danger', axiosErrToStr(err));
        });
    
    axios.get('/api/get-db-path')
        .then(resp => {
            dbPath = resp.data.val;
            DBPathInput.elem().val(dbPath);
        })
        .catch(err => {
            Alerts.insert('danger', axiosErrToStr(err));
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
