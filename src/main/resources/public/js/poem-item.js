/**
* @param {Poem} poem 
* @returns {mjComponent}
*/
function PoemItem(poem) {
    poem.stiches = poem.stich.split(/\r?\n/)
            .map(s => s.trim())
            .filter(x => !!x);
    if (poem.stiches.length > 1) {
        return multiLinePoemItem(poem);
    }
    return singleLinePoemItem(poem);
}

function singleLinePoemItem(poem) {
    const created = dayjs.unix(poem.created);
    const createdDateTime = created.format(DATE_TIME_FORMAT);
    const ItemAlerts = createAlerts();

    return cc('div', {
        id: elemID(poem.id),
        classes: 'PoemItem',
        children: [
            m('div').addClass('PoemTitle').text(poem.title),
            m('div').addClass('PoemStich').append(
                span(poem.stich),
                createLinkElem('#', {text: 'copy'}).addClass('CopyBtn').on('click', e => {
                    e.preventDefault();
                    copyToClipboard(poem.stich, ItemAlerts);
                })
            ),
            m('div').addClass('PoemIdTime').append(
                span(`id: ${poem.id} created at ${createdDateTime}`).addClass('text-grey'),
                createLinkElem('/edit-poem.html?id='+poem.id, {text: 'edit'}).addClass('EditBtn'),
            ),
            m(ItemAlerts),
        ],
    });
}

function multiLinePoemItem(poem) {
    const created = dayjs.unix(poem.created);
    const createdDateTime = created.format(DATE_TIME_FORMAT);
    const ItemAlerts = createAlerts();

    const self = cc('div', {
        id: elemID(poem.id),
        classes: 'PoemItem',
        children: [
            m('div').addClass('PoemTitle').text(poem.title),
            m('div').addClass('PoemIdTime').append(
                span(`id: ${poem.id} created at ${createdDateTime}`).addClass('text-grey'),
                createLinkElem('/edit-poem.html?id='+poem.id, {text: 'edit'}).addClass('EditBtn'),
                createLinkElem('#', {text: 'copy'}).addClass('CopyBtn').on('click', e => {
                    e.preventDefault();
                    copyToClipboard(poem.stich, ItemAlerts);
                }),
            ),
            m('ul').addClass('PoemStiches'),
            m(ItemAlerts),
        ],
    });

    self.init = () => {
        const poemsList = $(`${self.id} .PoemStiches`);
        poem.stiches.forEach(stich => {
            poemsList.append(
                m('li').append(
                    span(truncate(stich, GROUP_POEMS_LENGTH_LIMIT)),
                    createLinkElem('#', {text: 'copy'}).addClass('CopyBtn').on('click', e => {
                        e.preventDefault();
                        copyToClipboard(stich, ItemAlerts);
                    }),
                ));
        });
    };

    return self;
}
