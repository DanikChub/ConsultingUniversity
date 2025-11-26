export const handleAddTask = ({ makeOpen, i, j, value, themesArray, setThemesArray, openModal, closeModal, presentationSrcHandler, showTestClasses }) => {
    const valueNew = [...themesArray];
    
    switch(makeOpen) {
        case 'test':
            openModal('test', {i, j, remake: value});
            break;
        case 'practical_work':
            openModal('practicalWork', { i, j, remake: value });
            break;
        case 'lection':
            valueNew[i].puncts[j].lection_src = value;
            valueNew[i].puncts[j].lection_title = value.name;
            console.log(valueNew)
            setThemesArray(valueNew);
            break;
        case 'video':
            openModal('video', { i, j, remake: value });
            break;
        case 'presentation':
            presentationSrcHandler(i, value);
            break;
    }

    closeModal('addTask');
}