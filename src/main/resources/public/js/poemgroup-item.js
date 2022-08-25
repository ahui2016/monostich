/**
* @param {PoemGroup} poemGroup 
* @returns {mjComponent}
*/
function PoemGroupItem(poemGroup) {
    const updated = dayjs.unix(poemGroup.updated);
    const updatedDateTime = updated.format(DATE_TIME_FORMAT);
    const ItemAlerts = createAlerts();

    const self = cc('div', {
        id: elemID(poemGroup.id),
        classes: 'PoemGroupItem',
        children: [
            m('div').addClass('GroupTitle').text(poemGroup.title),
            m('ol').addClass('GroupPoems'),
            m('div').addClass('PoemIdTime').append(
                span(`id: ${poemGroup.id} updated at ${updatedDateTime}`).addClass('text-grey'),
                createLinkElem('/edit-group.html?id='+poemGroup.id, {text: 'edit'}).addClass('EditBtn'),
            ),
            m(ItemAlerts),
        ],
    });

    self.init = () => {
        const poemsList = $(`${self.id} .GroupPoems`);
        axios.get('/api/get-poems-by-group', {id: poemGroup.id})
            .then(resp => {
                poems = resp.data;
                poems.forEach(poem => {
                    poemsList.append(poem.stich);
                });
            })
            .catch(err => {
                ItemAlerts.insert('danger', axiosErrToStr(err));
            });
    };
}
