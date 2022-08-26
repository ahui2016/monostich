$('title').text('Creat a new group - monostich');

const Alerts = createAlerts();

const NaviBar = cc('div', { children: [
    createLinkElem('/', {text: 'monostich'}),
    span(' .. '),
    span('Creat a new group'),
]});

const SuccessArea = cc('div');

SuccessArea.update = (group) => {
    SuccessArea.elem().append([
        m('div').text(`id: ${group.id}`),
        m('div').text(`title: ${group.title}`),
        m('div').text(`stich: ${group.poems.join(', ')}`),
        m('div').text(`updated: ${dayjs.unix(group.updated).format()}`),
    ]);
};

const TitleInput = createInput();
const PoemsInput = createInput();
const SubmitBtn = cc('button', {text: 'Submit', classes: 'btn btn-fat'});
const FormAlerts = createAlerts();

// 这个按钮是隐藏不用的，为了防止按回车键提交表单
const HiddenBtn = cc('button', { id: 'submit', text: 'submit' });

const Form = cc('form', {attr: {autocomplete: 'off'}, children: [
    createFormItem(TitleInput, 'Title', '标题（说明/备注）'),
    createFormItem(PoemsInput, 'Poems', '一个或多个 Poem 的 ID 列表，用逗号或空格隔开'),
    m(FormAlerts),
    m(HiddenBtn).hide().on('click', e => {
        e.preventDefault();
        return false;
    }),
    m(SubmitBtn).on('click', event => {
        event.preventDefault();
        const title = valOf(TitleInput, 'trim');
        const poemsStr = valOf(PoemsInput, 'trim');
        const poems = itemsStringToArray(poemsStr).map(s => s.toUpperCase());

        if (!title) {
            FormAlerts.insert('danger', 'Title必填');
            focus(TitleInput);
            return;
        }
        if (!poems) {
            FormAlerts.insert('danger', 'Poems必填');
            focus(PoemsInput);
            return;
        }
        const body = {
            title: title,
            poems: poems,
        };
        axios.post('/api/insert-group', body)
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
    m(Form),
    m(Alerts).addClass('my-3'),
    m(SuccessArea),
);
    
init();

function init() {
    focus(TitleInput);
}
