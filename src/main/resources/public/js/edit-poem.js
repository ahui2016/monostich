$('title').text('Edit poem - monostich');

const poemID = getUrlParam('id');

const Alerts = createAlerts();

const NaviBar = cc('div', { children: [
    createLinkElem('/', {text: 'monostich'}),
    span(' .. '),
    span('Edit poem'),
]});

const DelBtn = createLinkElem('#', { text: 'Delete' });

const NaviLinks = cc('div', { children: [
    m(DelBtn),
]});

const IdInput = createInput();
const TitleInput = createInput();
const StichInput = createInput();
const CreatedInput = createInput();
const SubmitBtn = cc('button', {text: 'Update', classes: 'btn btn-fat'});
const FormAlerts = createAlerts();

// 这个按钮是隐藏不用的，为了防止按回车键提交表单
const HiddenBtn = cc('button', { id: 'submit', text: 'submit' });

const Form = cc('form', {attr: {autocomplete: 'off'}, children: [
    createFormItem(IdInput, "ID"),
    createFormItem(TitleInput, 'Title', '标题（说明/备注）'),
    createFormItem(StichInput, 'Stich', '一句话（例如一条命令、一个网址、一句备忘等等）'),
    createFormItem(CreatedInput, 'Created', '创建日期'),
    m(FormAlerts),
    m(HiddenBtn).hide().on('click', e => {
        e.preventDefault();
        return false;
    }),
    m(SubmitBtn).on('click', event => {
        event.preventDefault();
        const title = valOf(TitleInput, 'trim');
        const stich = valOf(StichInput, 'trim');
        if (!title) {
            FormAlerts.insert('danger', 'Title必填');
            focus(TitleInput);
            return;
        }
        if (!stich) {
            FormAlerts.insert('danger', 'Stich必填');
            focus(StichInput);
            return;
        }
        const body = {
            title: title,
            stich: stich,
        };
        axios.post('/api/update-poem', body)
            .then(resp => {
                Form.hide();
                Alerts.insert('success', '成功！');
                SuccessArea.update(resp.data);
            })
            .catch(err => {
                Alerts.insert('danger', axiosErrToStr(err));
            });
    }),
]});

Form.init = () => {
    axios.post('/api/get-poem', {id: poemID})
        .then(resp => {
            Form.show();
            const poem = resp.data;
            IdInput.elem().val(poem.id);
            disable(IdInput);
            TitleInput.elem().val(poem.title);
            StichInput.elem().val(poem.stich);
            const created = dayjs.unix(poem.created);
            CreatedInput.elem().val(created.format(DATE_TIME_FORMAT));
            disable(CreatedInput);
        })
        .catch(err => {
            Alerts.insert('danger', axiosErrToStr(err));
        });
};

$('#root').append(
    m(NaviBar).addClass('my-3'),
    m(NaviLinks),
    m(Form).hide(),
    m(Alerts).addClass('my-3'),
);
    
init();

function init() {
    Form.init();
}
