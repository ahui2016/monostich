/**
* @param {Poem} poem 
* @returns {mjComponent}
*/
function PoemItem(poem) {
    const created = dayjs.unix(poem.created);
    const createdDateTime = created.format('YYYY-MM-DD HH:mm:ss');
    const ItemAlerts = createAlerts();
    return cc('div', {
        id: elemID(poem.id),
        classes: 'PoemItem',
        children: [
            m('div').addClass('PoemTitle').text(poem.title),
            m('div').addClass('PoemStich').append(
                span(poem.stich),
                createLinkElem('#', {text: '(copy)'}).addClass('CopyBtn').on('click', e => {
                    e.preventDefault();
                    copyToClipboard(poem.stich, ItemAlerts);
                })
            ),
            m('div').addClass('PoemIdTime').append(
                span(`id: ${poem.id} created at ${createdDateTime}`).addClass('text-grey'),
            ),
            m(ItemAlerts),
        ],
    });
}
        