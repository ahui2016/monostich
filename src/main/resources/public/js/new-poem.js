$('title').text('Write a new poem - monostich');

const Alerts = createAlerts();

const NaviBar = cc('div', { children: [
    createLinkElem('/', {text: 'monostich'}),
    span(' .. '),
    span('Write a new poem'),
]});

const SuccessArea = cc('div');

SuccessArea.update = (poem) => {
    SuccessArea.elem().append([
        m('div').text(`id: ${poem.id}`),
        m('div').text(`title: ${poem.title}`),
        m('div').text(`stich: ${poem.stich}`),
        m('div').text(`created: ${dayjs.unix(poem.created).format()}`),
    ]);
};

const TitleInput = createInput();
const StichInput = createInput();
const SubmitBtn = cc('button', {text: 'Submit', classes: 'btn btn-fat'});
const FormAlerts = createAlerts();

// 这个按钮是隐藏不用的，为了防止按回车键提交表单
const HiddenBtn = cc('button', { id: 'submit', text: 'submit' });

const Form = cc('form', {attr: {autocomplete: 'off'}, children: [
    createFormItem(TitleInput, 'Title', '标题（说明/备注）'),
    createFormItem(StichInput, 'Stich', '一句话（例如一条命令、一个网址、一句备忘等等）'),
    m(FormAlerts).addClass('mb-3'),
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
        axios.post('/api/insert-poem', body)
            .then((resp) => {
                Form.hide();
                Alerts.insert('success', '成功！');
                SuccessArea.update(resp.data);
            })
            .catch(err => {
                Alerts.insert('danger', axiosErrToStr(err));
            });
    }),
]});

$('#root').append(
    m(NaviBar).addClass('my-3'),
    m(Alerts).addClass('my-3'),
    m(Form),
    m(SuccessArea),
);
    
init();

function init() {
    focus(TitleInput);
}
