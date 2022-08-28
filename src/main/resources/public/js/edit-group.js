$('title').text('Edit group - monostich');

const groupID = getUrlParam('id');

let group;

const Alerts = createAlerts();

const NaviBar = cc('div', { children: [
    createLinkElem('/', {text: 'monostich'}),
    span(' .. '),
    span('Edit group'),
]});

const IdInput = createInput();
const TitleInput = createInput();
const PoemsInput = createInput();
const UpdatedInput = createInput();
const SubmitBtn = cc('button', {text: 'Update', classes: 'btn btn-fat'});
const DelBtn = cc('a', {text: 'delete', classes: 'DelBtn', attr:{'href': '#'}});
const FormAlerts = createAlerts();

// 这个按钮是隐藏不用的，为了防止按回车键提交表单
const HiddenBtn = cc('button', { id: 'submit', text: 'submit' });

const Form = cc('form', {attr: {autocomplete: 'off'}, children: [
    createFormItem(IdInput, "ID"),
    createFormItem(TitleInput, 'Title', '标题（说明/备注）'),
    createFormItem(PoemsInput, 'Poems', '一个或多个 Poem 的 ID 列表，用逗号或空格隔开'),
    createFormItem(UpdatedInput, 'Updated', '更新日期'),
    m(FormAlerts).addClass('mb-3'),
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
        group.title = title;
        group.poems = poems;
        group.updated = dayjs().unix();
        axios.post('/api/update-group', group)
            .then(() => {
                FormAlerts.insert('success', '更新成功！');
            })
            .catch(err => {
                FormAlerts.insert('danger', axiosErrToStr(err));
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
                axios.post('/api/delete-group', {id: groupID})
                    .then(() => {
                        disable(TitleInput);
                        disable(PoemsInput);
                        SubmitBtn.hide();
                        DelBtn.hide();
                        FormAlerts.clear().insert('success', '已彻底删除。');
                    })
                    .catch(err => {
                        FormAlerts.insert('danger', axiosErrToStr(err));
                    });
            });
        }, 2000);
    }),
]});

Form.init = () => {
    axios.post('/api/get-group', {id: groupID})
        .then(resp => {
            Form.show();
            group = resp.data;
            IdInput.elem().val(group.id);
            disable(IdInput);
            TitleInput.elem().val(group.title);
            PoemsInput.elem().val(group.poems.join(', '));
            const updated = dayjs.unix(group.updated);
            UpdatedInput.elem().val(updated.format(DATE_TIME_FORMAT));
            disable(UpdatedInput);

            group.poems.forEach(poemID => {
                axios.post('/api/get-poem', {id: poemID})
                    .catch(err => {
                        if (err.response && err.response.status == 404) {
                            Alerts.insert('danger', 'Not Found: '+poemID);
                        } else {
                            Alerts.insert('danger', axiosErrToStr(err));
                        }
                    });
            });
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
