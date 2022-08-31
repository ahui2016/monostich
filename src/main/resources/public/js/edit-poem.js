$('title').text('Edit poem - monostich');

const poemID = getUrlParam('id');

let poem;

const Alerts = createAlerts();

const NaviBar = cc('div', { children: [
    createLinkElem('/', {text: 'monostich'}),
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
        poem.title = title;
        poem.stich = stich;
        axios.post('/api/update-poem', poem)
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
                axios.post('/api/delete-poem', {id: poemID})
                    .then(() => {
                        disable(TitleInput);
                        disable(StichInput);
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
    axios.post('/api/get-poem', {id: poemID})
        .then(resp => {
            Form.show();
            poem = resp.data;
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
    m(Alerts).addClass('my-3'),
    m(Form).hide(),
);
    
init();

function init() {
    Form.init();
}
