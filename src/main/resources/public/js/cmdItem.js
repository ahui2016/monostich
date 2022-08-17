/**
 * @param {Entry} entry 
 * @returns {mjComponent}
 */
function createCmdItem(entry) {
  const created = dayjs.unix(entry.created);
  const createdDateTime = created.format('YYYY-MM-DD HH:mm:ss');
  const ItemAlerts = createAlerts();
  return cc('div', {
    id: elemID(entry.id),
    classes: 'CmdItem',
    children: [
      m('div').addClass('CmdIdTime').append(
        span(`id: ${entry.id} created at ${createdDateTime}`).addClass('text-grey'),
      ),
      m('div').addClass('CmdNotes').text(entry.notes),
      m('div').addClass('CmdContent').append(
        span(entry.cmd),
        createLinkElem('#', {text: '(copy)'}).addClass('text-grey').on('click', e => {
          e.preventDefault();
          copyToClipboard(entry.cmd, ItemAlerts.id);
        })
      ),
      m(ItemAlerts),
    ],
  });
}
