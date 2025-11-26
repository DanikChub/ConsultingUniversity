const program_accordeons = document.querySelectorAll('.program_accordeon')

program_accordeons.forEach(program_accordeon => {
    program_accordeon.addEventListener('click', () => {
        if (program_accordeon.classList.contains('active')) {
            program_accordeon.classList.remove('active')
        } else {
            program_accordeon.classList.add('active')
        }
    })
})