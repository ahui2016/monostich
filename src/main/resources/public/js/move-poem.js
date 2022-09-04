$('title').text('Move poem - Monostich');

const poemID = getUrlParam('id');

let poem;

const Alerts = createAlerts();
const Loading = createLoading();

const NaviBar = cc('div', { children: [
    createLinkElem('/', {text: 'Monostich'}),
    span(' .. '),
    span('Move poem'),
]});

const TitleInput = createInput();
const StichInput = createInput();
const DBPathInput = createInput();
const SubmitBtn = cc('button', {text: 'Move', classes: 'btn btn-fat'});
const FormAlerts = createAlerts();

// 这个按钮是隐藏不用的，为了防止按回车键提交表单
const HiddenBtn = cc('button', { id: 'submit', text: 'submit' });

const Form = cc('form', {attr: {autocomplete: 'off'}, children: [
    createFormItem(TitleInput, 'Title'),
    createFormItem(StichInput, 'Stich'),
    createFormItem(DBPathInput, 'DatabasePath', '目标数据库位置'),
    m(FormAlerts).addClass('mb-3'),
    m(HiddenBtn).hide().on('click', e => {
        e.preventDefault();
        return false;
    }),
    m(SubmitBtn).on('click', event => {
        event.preventDefault();
        const dbPath = valOf(DBPathInput, 'trim');
        if (!dbPath) {
            FormAlerts.insert('danger', 'DatabasePath 必填');
            focus(DBPathInput);
            return;
        }
        const body = {
            id: poem.id,
            dbPath: dbPath,
        };
        axiosPost('/api/move-poem', body, FormAlerts, resp => {
            const result = resp.data;
            FormAlerts.insert('success',
                `移动成功! 旧id:${poem.id} 已删除, 新id:${result.id} 已创建。`);
            FormAlerts.insert('success', '目标数据库: ' + result.dbPath);
        });
    }),
]});

Form.init = () => {
    axiosPost('/api/get-poem', {id: poemID}, Alerts, resp => {
        Form.show();
        poem = resp.data;
        TitleInput.elem().val(poem.title);
        disable(TitleInput);
        StichInput.elem().val(poem.stich);
        disable(StichInput);
        FormAlerts.insert('info',
            '在 DatabasePath 中输入目标数据库位置，点击 Move 按钮，'+
            `将会删除当前记录 (id: ${poemID}), 并在目标数据库中创建新记录。`);
        focus(DBPathInput);
    },
    () => {
        Loading.hide();
    });
};

$('#root').append(
    m(NaviBar).addClass('mt-3 mb-5'),
    m(Alerts).addClass('my-3'),
    m(Loading).addClass('my-3'),
    m(Form).hide(),
);

init();

function init() {
    Form.init();
}
