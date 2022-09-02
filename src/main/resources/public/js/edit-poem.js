$('title').text('Edit poem - Monostich');

const poemID = getUrlParam('id');

let poem;

const Alerts = createAlerts();
const Loading = createLoading();

const NaviBar = cc('div', { children: [
    createLinkElem('/', {text: 'Monostich'}),
    span(' .. '),
    span('Edit poem'),
]});

const IdInput = createInput();
const TitleInput = createInput();
const StichInput = createTextarea();
const CreatedInput = createInput();
const SubmitBtn = cc('button', {text: 'Update', classes: 'btn btn-fat'});
const DelBtn = cc('a', {text: 'delete', classes: 'DelBtn', attr:{'href': '#'}});
const FormAlerts = createAlerts();

// 这个按钮是隐藏不用的，为了防止按回车键提交表单
const HiddenBtn = cc('button', { id: 'submit', text: 'submit' });

const Form = cc('form', {attr: {autocomplete: 'off'}, children: [
    createFormItem(IdInput, "ID"),
    createFormItem(TitleInput, 'Title', '标题（说明/备注）'),
    createFormItem(StichInput, 'Stich', '一句话（例如一条命令、一个网址、一句备忘等等）'),
    createFormItem(CreatedInput, 'Created', '创建日期'),
    m(FormAlerts).addClass('mb-3'),
    m(HiddenBtn).hide().on('click', e => {
        e.preventDefault();
        return false;
    }),
    m(SubmitBtn).on('click', event => {
        event.preventDefault();
        const title = valOf(TitleInput, 'trim');
        const stichRaw = valOf(StichInput, 'trim');
        if (!title) {
            FormAlerts.insert('danger', 'Title必填');
            focus(TitleInput);
            return;
        }
        if (!stichRaw) {
            FormAlerts.insert('danger', 'Stich必填');
            focus(StichInput);
            return;
        }
        const stich = stichRaw.split(/\r?\n/)
                .map(s => s.trim())
                .filter(x => !!x)
                .join('\n');

        poem.title = title;
        poem.stich = stich;
        axiosPost('/api/update-poem', poem, FormAlerts, () => {
            FormAlerts.insert('success', '更新成功！');
        });
    }),
    m(DelBtn).on('click', e => {
        e.preventDefault();
        disable(DelBtn);
        FormAlerts.insert(
            'danger', '当 delete 按钮变红时，再点击一次可执行删除，不可恢复。'
        );
        setTimeout(() => {
            enable(DelBtn);
            DelBtn.elem().css('color', 'red').off().on('click', e => {
                e.preventDefault();
                axiosPost('/api/delete-poem', {id: poemID}, FormAlerts, () => {
                    disable(TitleInput);
                    disable(StichInput);
                    SubmitBtn.hide();
                    DelBtn.hide();
                    FormAlerts.clear().insert('success', '已彻底删除。');
                });
            });
        }, 2000);
    }),
]});

Form.init = () => {
    axiosPost('/api/get-poem', {id: poemID}, Alerts, resp => {
        Form.show();
        poem = resp.data;
        IdInput.elem().val(poem.id);
        disable(IdInput);
        TitleInput.elem().val(poem.title);
        StichInput.elem().val(poem.stich);
        const created = dayjs.unix(poem.created);
        CreatedInput.elem().val(created.format(DATE_TIME_FORMAT));
        disable(CreatedInput);
    },
    () => {
        Loading.hide();
    });
};

$('#root').append(
    m(NaviBar).addClass('my-3'),
    m(Alerts).addClass('my-3'),
    m(Loading).addClass('my-3'),
    m(Form).hide(),
);
    
init();

function init() {
    Form.init();
}
